import tree_sitter_python as tspy
from pathlib import Path
from typing import Any, Dict, Union
from tree_sitter import Language, Parser, Node, Query, QueryCursor

class CodeParser:
    def __init__(self, file_path: Union[str, Path]):
        self.file_path = str(file_path)
        # Eager at class/instance for v0.2.0 (Lazy for v0.3.0)
        self.language = Language(tspy.language())
        self.parser = Parser(self.language)

    def _read_file(self) -> str:
        with open(self.file_path, "r", encoding="utf-8") as f:
            return f.read()

    def parse(self) -> Node:
        """
        The Core Engine Hook. 
        Returns the AST root node for the scanners to consume.
        """
        code = self._read_file()
        tree = self.parser.parse(bytes(code, "utf8"))
        return tree.root_node

    def get_metadata(self) -> Dict[str, Any]:
        """
        Extracts libraries and raw code for reporting.
        """
        root_node = self.parse()
        code = self._read_file()
        
        metadata = {
            "libraries": [],
            "raw_code": code,
            "root": root_node
        }

        # v0.22+ Query Implementation
        query_scm = """
            (import_from_statement (dotted_name) @mod)
            (import_statement (dotted_name) @mod)
        """
        query = Query(self.language, query_scm)
        captures = QueryCursor(query).captures(root_node)

        if "mod" in captures:
            for node in captures["mod"]:
                if node.text:
                    lib_name = node.text.decode('utf8')
                    if lib_name not in metadata["libraries"]:
                        metadata["libraries"].append(lib_name)

        return metadata
