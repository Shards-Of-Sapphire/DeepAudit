import argparse
import os
import sys
import time
from math import ceil
from pathlib import Path
from multiprocessing import Process, Queue, cpu_count

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = PROJECT_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from deepaudit.engine.parser import CodeParser
from deepaudit.scanners import ACTIVE_SCANNERS
from deepaudit.utils.logger import get_logger

try:
    import psutil
except ImportError:  # pragma: no cover - optional dependency
    psutil = None

logger = get_logger("BOMBARD")


class BombardmentEngine:
    def __init__(self, target_path, workers):
        self.target_path = Path(target_path)
        self.workers = workers if workers > 0 else cpu_count()
        self.results_queue = Queue()

    def get_payload(self):
        """Recursively gather supported source files."""
        extensions = {".py"}
        return [
            str(path)
            for path in self.target_path.rglob("*")
            if path.suffix in extensions and path.is_file()
        ]

    def chunk_payload(self, files):
        if not files:
            return []

        chunk_size = max(1, ceil(len(files) / max(1, self.workers)))
        return [files[index : index + chunk_size] for index in range(0, len(files), chunk_size)]

    @staticmethod
    def worker_task(files, queue):
        """
        Parse each file and run scanners against the scanner metadata.
        """
        process = psutil.Process(os.getpid()) if psutil else None

        for file_path in files:
            start_time = time.perf_counter()
            try:
                parser = CodeParser(file_path)
                metadata = parser.get_metadata()

                findings_count = 0
                for scanner in ACTIVE_SCANNERS:
                    findings = scanner(metadata) or []
                    findings_count += len(findings)

                duration = (time.perf_counter() - start_time) * 1000
                mem_usage = (
                    process.memory_info().rss / (1024 * 1024)
                    if process is not None
                    else None
                )

                queue.put(
                    {
                        "status": "SUCCESS",
                        "file": file_path,
                        "ms": duration,
                        "mem_mb": mem_usage,
                        "findings": findings_count,
                    }
                )
            except Exception as exc:  # pragma: no cover - multiprocessing surface
                queue.put({"status": "ERROR", "file": file_path, "error": str(exc)})

    def run(self):
        files = self.get_payload()
        total_files = len(files)
        if total_files == 0:
            logger.info("No supported files found under %s", self.target_path)
            return

        logger.info(
            "Bombardment start: %s files with %s workers",
            total_files,
            self.workers,
        )

        chunks = self.chunk_payload(files)

        processes = []
        for chunk in chunks:
            process = Process(target=self.worker_task, args=(chunk, self.results_queue))
            processes.append(process)
            process.start()

        processed = 0
        errors = 0
        total_ms = 0.0
        peak_mem = 0.0

        while processed < total_files:
            res = self.results_queue.get()
            processed += 1
            if res["status"] == "SUCCESS":
                total_ms += res["ms"]
                if res["mem_mb"] is not None:
                    peak_mem = max(peak_mem, res["mem_mb"])
            else:
                errors += 1

        for process in processes:
            process.join()

        self.report(total_files, errors, total_ms, peak_mem)

    def report(self, total, errors, total_ms, peak_mem):
        avg_speed = total_ms / (total - errors) if (total - errors) > 0 else 0
        logger.info("--- BOMBARDMENT REPORT ---")
        logger.info("Total Files: %s", total)
        logger.info("Failed Parsings: %s", errors)
        logger.info("Avg Latency: %.2fms/file", avg_speed)
        logger.info("Peak Worker RSS: %.2fMB", peak_mem)
        logger.info("--------------------------")


def test_get_payload_filters_supported_files(tmp_path):
    (tmp_path / "service.py").write_text("print('ok')", encoding="utf-8")
    (tmp_path / "notes.txt").write_text("skip", encoding="utf-8")
    nested = tmp_path / "nested"
    nested.mkdir()
    (nested / "script.js").write_text("console.log('ok')", encoding="utf-8")

    engine = BombardmentEngine(tmp_path, workers=4)
    payload = sorted(Path(path).name for path in engine.get_payload())

    assert payload == ["service.py"]


def test_chunk_payload_handles_more_workers_than_files(tmp_path):
    engine = BombardmentEngine(tmp_path, workers=8)
    chunks = engine.chunk_payload(["a.py", "b.py"])

    assert chunks == [["a.py"], ["b.py"]]

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DeepAudit stress tester")
    parser.add_argument("--path", required=True, help="Path to payload directory")
    parser.add_argument("--workers", type=int, default=0, help="Number of processes")
    args = parser.parse_args()

    bombard = BombardmentEngine(args.path, args.workers)
    bombard.run()
