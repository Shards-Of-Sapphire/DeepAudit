### Engine Module (src/engine/)
The orchestration layer that transforms raw source code into queryable AST structures.

# Key Features:
1. *Lazy Instance Initialization*: Grammars are loaded only when a CodeParser instance is created for a specific file extension, preventing unnecessary memory overhead from unused language binaries.

2. *Tree-sitter Integration (v0.22+)*: High-speed parsing that converts source code into a Concrete Syntax Tree (CST), allowing for deep structural analysis beyond regex.

3. *Error-Tolerant Parsing*: Sophisticated handling of ERROR nodes; the engine isolates syntax errors to specific branches, allowing the rest of the file to be audited successfully.

4. *Targeted Loading*: Current support for .py, .js, and .java, with the engine automatically mapping extensions to their respective compiled .so/.dll grammars.