import os
from pathlib import Path
from typing import List, Set, Optional

from deepaudit.utils.logger import get_logger

logger = get_logger("CRAWLER")

class SourceCrawler:
    """
    A high-performance directory crawler designed to isolate production Python code.
    
    This class recursively traverses a given root directory, aggressively filtering 
    out testing environments, caches, and configuration files to ensure downstream 
    agents (like Autodoc or Scanners) only process pure application logic.
    """

    def __init__(self, root_dir: str, exclude_init: bool = True):
        """
        Initializes the SourceCrawler with strict exclusion rules.

        Args:
            root_dir (str): The absolute or relative path to the source root.
            exclude_init (bool): If True, __init__.py files are ignored. 
                                 Defaults to True to keep documentation clean.
        """
        self.root: Path = Path(root_dir).resolve()
        self.exclude_init: bool = exclude_init
        
        # The "Blacklist": Directories that must never be scanned
        self.ignore_dirs: Set[str] = {
            "__pycache__", 
            "tests", 
            "tmp", 
            ".venv", 
            "venv", 
            "env", 
            ".git", 
            ".tox", 
            ".mypy_cache",
            "node_modules"
        }

        if not self.root.exists():
            logger.warning(f"Crawler initialized with non-existent root: {self.root}")

    def _is_valid_target(self, file_path: Path) -> bool:
        """
        Evaluates a single file path against the exclusion rules.

        Args:
            file_path (Path): The absolute path to evaluate.

        Returns:
            bool: True if the file should be processed, False if it hits a blacklist.
        """
        # 1. Directory Blacklist Check
        # If any part of the path matches our ignored directories, drop it.
        if any(part in self.ignore_dirs for part in file_path.parts):
            return False

        # 2. Init File Check
        if self.exclude_init and file_path.name == "__init__.py":
            return False

        return True

    def get_python_files(self) -> List[Path]:
        """
        Executes the recursive crawl to find all valid Python modules.

        Returns:
            List[Path]: A sorted list of absolute pathlib.Path objects pointing 
                        to valid .py files. Returns an empty list if root fails.
        """
        if not self.root.exists() or not self.root.is_dir():
            logger.error(f"Cannot crawl. Invalid directory: {self.root}")
            return []

        valid_files: List[Path] = []
        
        # rglob("*.py") creates a generator of all python files down the tree
        for file_path in self.root.rglob("*.py"):
            if self._is_valid_target(file_path):
                valid_files.append(file_path)

        # Sorting ensures predictable execution order for tests and documentation
        sorted_files = sorted(valid_files)
        
        logger.debug(f"Crawler isolated {len(sorted_files)} valid Python files in {self.root.name}/")
        return sorted_files