# **DeepAudit**
*The "X-Ray" for AI-Generated Code*

Collective: Sapphire

Status: MVP (v0.3.0)

# The Mission
As AI agents (like AutoGPT, OpenDevin, and Gemini) become standard in software workflows, we face a new security frontier: The Hallucination Gap. AI frequently generates code using libraries that don't exist or logic that contains "mental lapses" (like hardcoded credentials or eval() traps).

DeepAudit is a specialized static analysis tool (SAST) built to bridge this gap by performing high-speed AST parsing and real-time registry verification.

# The "DeepAudit" Method
DeepAudit doesn't just "read" code; it understands its structure through a four-phase pipeline:

**1. The X-Ray (AST Parsing)**:  
Using the Tree-sitter engine (the same tech powering GitHub and VS Code), DeepAudit generates a Concrete Syntax Tree (CST) of the target file. This allows us to find imports and function calls even if they are obfuscated or hidden in complex logic.

**2. The Truth Seeker (Dependency Guard)**:  
Every identified library is cross-referenced in real-time against the PyPI registry.

**The Problem**: AI often hallucinations "ideal" libraries (e.g., fastapi-secure-auth-v2).

**The Solution**: DeepAudit flags any dependency not found on official mirrors as a CRITICAL HALLUCINATION.

**3. Logic Integrity Scan**:  
We scan the AST for "Lazy AI Patterns":

Dangerous Sinks: eval(), exec(), and os.system().

Logic Flaws: Unclosed ports or unhandled exceptions in generated boilerplate.

**4. Confidentiality Shield**:  
A high-entropy regex engine scans for "Accidental Leaks"—strings that match the signature of AWS Keys, GitHub PATs, or Stripe Secrets.

# Technical Stack
Engine: tree-sitter (C-bindings for high-speed parsing)

Registry API: requests (Synchronous verification)

Interface: rich (Modern, accessible CLI output)

Environment: python-dotenv (Secure secret management)

Architecture: src layout (Industry standard for distributable Python packages)

# Quick Start
1. Initialize the Environment
```
# Create and activate the virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install the core engine and grammar
pip install -r requirements.txt
pip install -e .
```

2. Run your first Audit
Bash
```
deepaudit tests/v0.3.1_test.py
```
The repository now includes [`tests/v0.3.1_test.py`](tests/v0.3.1_test.py) as a sample input.
🧪 Quality Assurance
DeepAudit maintains a generous pass rate on its core scanner suite. Run the tests via:

Bash
```
pytest tests/
```
# 💎 About Sapphire
DeepAudit is a flagship project of the Sapphire Collective, a student-led engineering group focused on building robust, AI-native infrastructure for the 2026 developer ecosystem.

# Contact: [shardsofsapphire.org@gmail.com]
