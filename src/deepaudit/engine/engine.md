<<<<<<< HEAD
### Engine Module (src/engine/)
The orchestration layer that transforms raw source code into queryable AST structures.

# Key Features:
1. *Lazy Instance Initialization*: Grammars are loaded only when a CodeParser instance is created for a specific file extension, preventing unnecessary memory overhead from unused language binaries.

2. *Tree-sitter Integration (v0.22+)*: High-speed parsing that converts source code into a Concrete Syntax Tree (CST), allowing for deep structural analysis beyond regex.

3. *Error-Tolerant Parsing*: Sophisticated handling of ERROR nodes; the engine isolates syntax errors to specific branches, allowing the rest of the file to be audited successfully.

4. *Targeted Loading*: Current support for .py, .js, and .java, with the engine automatically mapping extensions to their respective compiled .so/.dll grammars.
=======
# ⚙️ DeepAudit Engine: The Code Translator

Welcome to the `engine` directory! If DeepAudit is an X-Ray machine, this folder is the lens that focuses the beam. 

## What does the Engine do?
When you feed a Python file into DeepAudit, the computer just sees a giant block of text. It doesn't know the difference between a `def` function, a `# comment`, or a `"string"`. 

The `engine` translates that raw text into a mathematical structure called an **Abstract Syntax Tree (AST)**. Think of it like diagramming a sentence in English class. Instead of just seeing words, the AST labels the "Nouns" (variables), the "Verbs" (functions), and the "Punctuation" (brackets).

## Core Component: `parser.py`
Inside this folder, you will find `parser.py`. This file contains the `CodeParser` class, which uses a powerful library called `tree-sitter-python`.

**How it works (The v0.3.0 Standard):**
1. **Reading:** The parser reads your target file as raw, unformatted bytes.
2. **Translating:** It feeds those bytes into Tree-sitter.
3. **Delivering:** It returns the `root_node` (the very top of the syntax tree) directly to the rest of the program. 

**Why we do this:** By doing the heavy lifting of parsing exactly *once* at the very beginning, all of our different security scanners can share the exact same tree. This makes DeepAudit incredibly fast, even if we add 50 different security checks later!
>>>>>>> ba8e9ed80daf1e7830b688e8357da3c9ccf9ca6d
