# 🌳 Tree-sitter API Standard (v0.21+)

*1. Query Execution*
Do NOT use `query.captures()` as an attribute. Use the following execution pattern for the 2026 Python bindings:

```python
# Create the query via the Language object
query = PY_LANGUAGE.query(query_text)

# Execute on the root node
captures = query.captures(root_node)

# Iterate through the list of (node, tag) tuples
for node, tag in captures:
    # node.start_byte and node.end_byte are used for slicing source
```
*2. Common Node Types*
​```import_statement: Standard import x
​import_from_statement: from x import y
​call: Any function call (e.g., print())
​string: Any literal string (crucial for Secret Scanning)
​attribute: Accessing a sub-module (e.g., os.path)```
