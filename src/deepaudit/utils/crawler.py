import os
from pathlib import Path
from typing import List, Set

from deepaudit.utils.logger import get_logger

logger = get_logger("CRAWLER")

class SourceCrawler:
    def __init__(self, root_dir: str, exclude_init: bool = True):
        self.root: Path = Path(root_dir).resolve()
        self.exclude_init: bool = exclude_init
        
        # The "Blacklist"
        self.ignore_dirs: Set[str] = {
            "__pycache__", "tests", "tmp", ".venv", "docs"
        }

        if not self.root.exists():
            logger.warning(f"Crawler initialized with non-existent root: {self.root}")

    def _is_valid_target(self, file_path: Path) -> bool:
        if any(part in self.ignore_dirs for part in file_path.parts):
            return False
        if self.exclude_init and file_path.name == "__init__.py":
            return False
        return True

    def get_python_files(self) -> List[Path]:
        if not self.root.exists() or not self.root.is_dir():
            logger.error(f"Cannot crawl. Invalid directory: {self.root}")
            return []

        valid_files: List[Path] = []
        
        for file_path in self.root.rglob("*.py"):
            if self._is_valid_target(file_path):
                valid_files.append(file_path)

        sorted_files = sorted(valid_files)
        logger.debug(f"Crawler isolated {len(sorted_files)} valid Python files.")
        return sorted_files