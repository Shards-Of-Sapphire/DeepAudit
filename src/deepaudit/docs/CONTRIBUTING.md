<<<<<<< HEAD
# Contributing to DeepAudit

## 1. Branching Strategy
- `main`: Production-ready, stable releases (v0.1.0, etc.).
- `dev`: Active feature development.
- `feature/[name]`: Experimental features (e.g., `feature/aquarium-sandbox`).

## 2. Review Process
1. Create a Pull Request (PR) from your feature branch to `dev`.
2. Ensure `pytest` passes 100%.
3. **Lead Approval:** Zayed (Lead Architect) must review the AST logic.
4. **Backend Approval:** Shoaib (Backend Control) must verify the execution flow.

## 3. Code Quality
- Use **Type Hinting** for all new functions.
- Document every class and module.
- Never hardcode API keys or system paths.
=======
# 🤝 Contributing to DeepAudit: A Sapphire Guide

Welcome to the team! DeepAudit is built by the Sapphire Collective. We want you to help us build new security scanners. Here is exactly how you do it without breaking the flagship.

## How to Build a New Scanner in 3 Steps

**Step 1: Create the File**
Create a new file in `src/deepaudit/scanners/` (for example, `my_scanner.py`).

**Step 2: Follow the Contract**
Your file **MUST** contain a function named exactly `scan`. It must accept exactly three arguments, and it must return a list of dictionaries. Copy and paste this template:

```python
def scan(ast_node, raw_code: str, file_path: str) -> list[dict]:
    findings = []
    
    # ... Write your logic here! Read the raw_code or the ast_node ...
    
    # If you find a vulnerability, add it to the list like this:
    # findings.append({
    #     "scanner": "MyAwesomeScanner",
    #     "severity": "WARNING", 
    #     "line": 42,
    #     "message": "Explain what went wrong simply.",
    #     "snippet": "The line of code that failed"
    # })
    
    return findings
```

**Step 3: Test and Document**
Run deepaudit tests/bombard_test.py to make sure your scanner doesn't crash the engine. Then, run python tools/autodoc.py to add your new scanner to the official Codex!

🚨 The Golden Rules
1. **Never use** ```src.``` in your imports. Always import like this: ```from deepaudit.utils.logger import get_logger```.

2. __Don't save global data.__ Your scanner should look at one file, report its findings, and forget it ever happened. Do not use global variables to count things across multiple files, because our parallel processors will crash!

### 6. `docs/TREESITTER_REFERENCE.md`

## 🌳 Tree-sitter Quick Reference: Understanding the AST

DeepAudit uses `tree-sitter` to turn code into a tree. If you want to write advanced scanners, you need to understand how to climb this tree!

## Why not just use `Ctrl+F` (Regex)?
If you are looking for a function called `login`, you could just search for the text `"def login"`. But what if the AI wrote a comment that says `# DO NOT def login`? A simple text search would get confused and flag the comment! 

Tree-sitter actually *reads* the code. It knows the difference between a function, a variable, and a comment.

## Visualizing the Tree
Imagine this simple line of code:
`x = 5 + 10`

Tree-sitter sees it like this:
* **assignment_statement** (The whole line)
    * **left:** `identifier` (x)
    * **right:** `binary_operator` (+)
        * **left:** `integer` (5)
        * **right:** `integer` (10)

## How to search the Tree in your Scanner
When the engine gives you the `ast_node`, you can ask it to find specific parts of the tree. Here is a simple example of how to find the names of every function in a file:

```python
def find_all_functions(ast_node):
    found_functions = []
    
    # Look at every branch connected to the main trunk
    for child in ast_node.children:
        # Is this branch a function definition?
        if child.type == 'function_definition':
            # Get the specific leaf that holds the function's name
            name_node = child.child_by_field_name('name')
            if name_node:
                found_functions.append(name_node.text.decode('utf8'))
                
    return found_functions
>>>>>>> ba8e9ed80daf1e7830b688e8357da3c9ccf9ca6d
