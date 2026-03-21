from importlib.metadata import metadata

from rich import tree
import tree_sitter_python as tspy
from typing import Any, cast
from tree_sitter import Language, Parser, QueryCursor

class CodeParser:
    def __init__(self, file_path):
        self.file_path = file_path
        self.language = Language(tspy.language())
        self.parser = Parser(self.language)

    def _read_file(self):
        with open(self.file_path, "r", encoding="utf-8") as f:
            return f.read()

    def get_metadata(self):
        code = self._read_file()
        tree = self.parser.parse(bytes(code, "utf8"))
        root_node = tree.root_node
        
        metadata = {
            "libraries": [],
            "raw_code": code,
            "root": root_node
        }

        # The query string defines the 'map'
        query = cast(Any, self.language.query("""
            (import_from_statement module_name: (_) @mod)
            (import_statement name: (_) @mod)
        """))
        
        # 1. Fix the __init__ error: Pass 'query' into the constructor
        cursor = QueryCursor(query)
        
        # 2. Fix the attribute error: Use the cursor to get captures
        results = cursor.captures(root_node)
        
        if "mod" in results:
            for node in results["mod"]:
                # 3. Fix the .decode() error: Check if text is not None
                # Pylance won't complain if we explicitly check for existence
                if node.text is not None:
                    lib_name = node.text.decode('utf8')
                    if lib_name not in metadata["libraries"]:
                        metadata["libraries"].append(lib_name)

        return metadata