import argparse
import ast
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = PROJECT_ROOT / "src"
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from src.deepaudit.utils.crawler import SourceCrawler
from src.deepaudit.utils.logger import get_logger
from tools.renderer import MarkdownRenderer
logger = get_logger("AUTODOC")


class AutodocAgent:
    def __init__(self):
        self.crawler = SourceCrawler(PROJECT_ROOT / "src")
        self.renderer = MarkdownRenderer(
            output_path=str(PROJECT_ROOT / "docs" / "API_CODEX.md")
        )
        self.registry = {}

    @staticmethod
    def clean_docstring(node: ast.AST) -> str:
        doc = ast.get_docstring(node)
        if not doc:
            return "*Warning: No docstring provided.*"
        return doc.strip()

    @staticmethod
    def _signature_for_function(node: ast.AST) -> str:
        if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            return "()"

        args = [arg.arg for arg in node.args.args]
        if node.args.vararg:
            args.append(f"*{node.args.vararg.arg}")
        args.extend(arg.arg for arg in node.args.kwonlyargs)
        if node.args.kwarg:
            args.append(f"**{node.args.kwarg.arg}")
        return f"({', '.join(args)})"

    def process_file(self, file_path: Path, strict_mode: bool):
        source = file_path.read_text(encoding="utf-8")
        module = ast.parse(source, filename=str(file_path))
        module_data = {"classes": [], "functions": []}
        missing_docs = 0

        for node in module.body:
            if isinstance(node, ast.ClassDef):
                doc = self.clean_docstring(node)
                if strict_mode and doc.startswith("*Warning") and not node.name.startswith("_"):
                    logger.error("Missing docstring in %s: class %s", file_path, node.name)
                    missing_docs += 1
                module_data["classes"].append({"name": node.name, "doc": doc})
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                doc = self.clean_docstring(node)
                if strict_mode and doc.startswith("*Warning") and not node.name.startswith("_"):
                    logger.error("Missing docstring in %s: def %s()", file_path, node.name)
                    missing_docs += 1
                module_data["functions"].append(
                    {
                        "name": node.name,
                        "params": self._signature_for_function(node),
                        "return": None,
                        "doc": doc,
                    }
                )

        return module_data, missing_docs

    def run(self, strict_mode=False):
        logger.info("Booting autodoc agent...")
        files = self.crawler.get_python_files()
        total_missing = 0

        for python_file in files:
            data, missing = self.process_file(python_file, strict_mode)
            self.registry[str(python_file)] = data
            total_missing += missing

        self.renderer.render(self.registry)
        logger.info("Codex successfully mapped to docs/API_CODEX.md")

        if strict_mode and total_missing > 0:
            logger.error(
                "STRICT MODE FAILED: %s public methods lack docstrings.",
                total_missing,
            )
            sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DeepAudit autodoc agent")
    parser.add_argument("--check", action="store_true", help="Fail with exit code 1 if docstrings are missing.")
    args = parser.parse_args()

    agent = AutodocAgent()
    agent.run(strict_mode=args.check)
