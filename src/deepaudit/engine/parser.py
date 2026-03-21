from importlib.metadata import metadata

from rich import tree
import tree_sitter_python as tspy
from typing import Any, cast
from tree_sitter import Language, Parser

class CodeParser:
    def __init__(self, file_path):
        self.file_path = file_path
        self.language = Language(tspy.language())
        self.parser = Parser(self.language)
        
    def _read_file(self):
        with open(self.file_path, "r", encoding="utf-8") as f:
            return f.read()

    def get_metadata(self):
        """
        The 'X-Ray' engine. Extracts the blueprint for Aayat's scanners.
        """
        code = self._read_file()
        tree = self.parser.parse(bytes(code, "utf8"))
        root_node = tree.root_node
        
        metadata = {
            "libraries": [],
            "raw_code": code,
            "root": root_node
        }

        # Query to find all imports
        # Change your query to this:
        query = cast(Any, self.language.query("""
            (import_from_statement module_name: (_) @mod)
            (import_statement name: (_) @mod)
        """))
        
        # NEW API: Use .matches() instead of .captures()
        # matches is a list of QueryMatch objects
        matches = query.matches(root_node)

        for match in matches:
            # Each match has a 'captures' dictionary
            # In the new API, captures is often a dict of {tag: [nodes]}
            for tag, nodes in match.captures.items():
                if tag == "mod":
                    for node in nodes:
                        # node.text is already bytes, we decode to string
                        lib_name = node.text.decode('utf8')
                        if lib_name not in metadata["libraries"]:
                            metadata["libraries"].append(lib_name)

        return metadata