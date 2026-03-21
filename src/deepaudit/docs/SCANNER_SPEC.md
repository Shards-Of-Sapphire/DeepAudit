# Scanner Development Guide

All new scanners must adhere to the **Sapphire Integrity Standard**.

## 1. Input/Output Contract
Every scanner must be a function that accepts a `metadata` dict and returns a `findings` list.

**Required Schema for Findings:**
```python
{
    "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
    "issue": "Brief description of the vulnerability",
    "fix": "Specific instruction to resolve the risk",
    "line": int  # Optional: line number from AST
}
```

## 2. Priority List for v0.2.0
[ ] JavaScript Support: Integrate tree-sitter-javascript.

[ ] Fuzzy Matching: Detect "Typosquatting" (e.g., pandass instead of pandas).

[ ] Environment Check: Check if the file is trying to access .env or system variables.

---
