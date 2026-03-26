from asyncio.log import logger
from importlib.metadata import metadata
from deepaudit.utils.logger import get_logger
from pathlib import Path
from rich import tree
import tree_sitter_python as tspy
from typing import Any, cast
from tree_sitter import Language, Parser

logger = get_logger("PARSER")

class CodeParser:

    """
    The DeepAudit Tree-sitter parsing engine.
    Transforms raw Python source code into an Abstract Syntax Tree (AST)
    for the Scanner Registry to analyze.
    """

    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.language = Language(tspy.language())
        self.parser = Parser(self.language)

    def parse(self):
        """
        Reads the target file and parses it into an AST.
        
        Returns:
            tree_sitter.Node: The root node of the generated AST.
        """
        if not self.file_path.exists():
            raise FileNotFoundError(f"Cannot parse missing file: {self.file_path}")

        # Read the file as raw bytes for Tree-sitter
        with open(self.file_path, "rb") as f:
            source_bytes = f.read()

        # Generate the AST
        tree = self.parser.parse(source_bytes)
        
        # Return the absolute root node of the tree to the CLI
        return tree.root_node

__all__ = ["CodeParser"]