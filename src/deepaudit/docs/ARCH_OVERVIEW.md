# 🏛️ DeepAudit Backend Architecture

### 1. Core Philosophy
DeepAudit is a **Modular Static Analysis Tool (SAST)**. The current implementation targets Python, with room to expand into additional languages later.

### 2. The Execution Pipeline
Every audit must follow this strict sequence:
1. **Ingestion:** CLI reads the target file as UTF-8.
2. **AST Parsing (The X-Ray):** `engine/parser.py` generates a Tree-sitter CST.
3. **Metadata Extraction:** Relevant nodes (imports, calls, assignments) are extracted into a `metadata` dictionary.
4. **Scanner Execution:** Parallel or sequential execution of modules in `scanners/`.
5. **Reporting:** Data is passed to `reporter/` for JSON or Markdown rendering.

### 3. Data Schema: The Metadata Object
All scanners expect a dictionary with this minimum structure:
```python
{
    "libraries": ["list", "of", "strings"],
    "root": "<tree_sitter.Node>",
    "raw_code": "string_of_original_code",
    "path": "path_to_the_source_file"
}
```
