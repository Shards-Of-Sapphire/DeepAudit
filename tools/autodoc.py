import sys
import ast
import argparse
from pathlib import Path

# 1. FIXED IMPORTS: Drop 'src.' and import directly from the installed package
from deepaudit.utils.logger import get_logger
from deepaudit.utils.crawler import SourceCrawler
from tools.renderer import MarkdownRenderer

logger = get_logger("AUTODOC")

class AutodocAgent:
    def __init__(self):
        # Ensure your paths are absolute relative to the project root
        self.project_root = Path(__file__).resolve().parent.parent
        self.crawler = SourceCrawler(str(self.project_root / "src"))
        self.renderer = MarkdownRenderer(str(self.project_root / "docs" / "API_CODEX.md"))
        self.registry = {}

    def process_file(self, file_path: Path, strict_mode: bool) -> tuple[dict, int]:
        """Uses Python's native AST to rigidly extract docstrings."""
        with open(file_path, "r", encoding="utf-8") as f:
            source_code = f.read()

        try:
            # Native Python AST parsing (Bulletproof for Python files)
            tree = ast.parse(source_code, filename=str(file_path))
        except SyntaxError as e:
            logger.error(f"Syntax error in {file_path}: {e}")
            return {"classes": [], "functions": []}, 0

        module_data = {"classes": [], "functions": []}
        missing_docs = 0

        for node in ast.walk(tree):
            # Process Classes
            if isinstance(node, ast.ClassDef):
                doc = ast.get_docstring(node)
                module_data["classes"].append({
                    "name": node.name,
                    "doc": doc if doc else "No documentation provided."
                })

            # Process Functions/Methods
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                # Skip private/dunder methods unless it's __init__
                if node.name.startswith("_") and node.name != "__init__":
                    continue

                doc = ast.get_docstring(node)
                
                if strict_mode and not doc:
                    logger.warning(f"Missing docstring: {file_path.name} -> def {node.name}()")
                    missing_docs += 1

                # Extract arguments safely
                args = [arg.arg for arg in node.args.args]
                param_str = f"({', '.join(args)})"

                module_data["functions"].append({
                    "name": node.name,
                    "params": param_str,
                    "return": "Any", # Placeholder for advanced type hint extraction
                    "doc": doc if doc else "*Warning: No docstring provided.*"
                })

        return module_data, missing_docs

    def run(self, strict_mode=False):
        logger.info("🚀 Booting v0.3.0 Autodoc Agent (Native AST Mode)...")
        files = self.crawler.get_python_files()
        total_missing = 0

        for pf in files:
            data, missing = self.process_file(pf, strict_mode)
            self.registry[str(pf)] = data
            total_missing += missing
            
        self.renderer.render(self.registry)
        logger.info(f"✅ Codex successfully mapped to docs/API_CODEX.md")

        if strict_mode and total_missing > 0:
            logger.error(f"❌ STRICT MODE FAILED: {total_missing} public methods lack docstrings.")
            sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DeepAudit Autodoc Agent")
    parser.add_argument("--check", action="store_true", help="Fail if docstrings are missing.")
    args = parser.parse_args()

    agent = AutodocAgent()
    agent.run(strict_mode=args.check)