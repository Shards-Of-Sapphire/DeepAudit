###DeepAudit 🛡️###
##The Intelligent Security Layer for Agentic Code.##

DeepAudit is a specialized static analysis tool (SAST) designed to solve the "Verification Gap" in AI-generated code. While traditional tools look for known CVEs, DeepAudit identifies AI-native risks: hallucinated dependencies, dangerous logic patterns, and accidental credential leakage.

🧠 The "DeepAudit" Method
AI agents often prioritize "working code" over "secure code." DeepAudit intercepts this by running four distinct security phases:

The X-Ray (AST Engine): Uses a high-performance Tree-sitter parser to build a Concrete Syntax Tree (CST) of the code. This is more resilient than regex, allowing us to find imports and function calls even if they are obfuscated.

The Hallucination Guard: Performs real-time registry lookups (PyPI/NPM) to verify that every imported library actually exists. This catches "Phantom Packages" before they are installed.

Logic Integrity Scan: Detects high-risk patterns like eval(), exec(), or unparameterized shell commands that AI often uses as "shortcuts."

Secret Shield: Scans for high-entropy strings matching the signatures of AWS keys, GitHub tokens, and other sensitive credentials.

🚀 Quick Start (Sapphire Collective)
Prerequisites
Python 3.10+

Git

Installation
Bash
# Clone the repository
git clone https://github.com/shaikzayed/DeepAudit.git
cd DeepAudit

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install in editable mode (Developer Mode)
pip install -e ".[dev]"
Running an Audit
Bash
deepaudit examples/fake_deps.py
🧪 Testing
We maintain a 1:1 ratio of features to tests. To run the suite:

Bash
pytest
🛠️ Tech Stack
Parser: Tree-sitter (C/Rust bindings)

CLI: Rich (Modern Terminal UI)

Registry API: Python Requests

Project Management: Setuptools / Pyproject.toml

Lead Architect: Shaik Zayed Saleem

Organization: Sapphire Collective

“Building the secure future of AI-assisted development.”

Final Milestone Check
Project Structure: 📂 Done

AST Engine: 🧠 Done (The "Version War" survivor)

Registry Checker: ✅ Done

Secret Scanner: 🔒 Done

Test Suite: 🧪 Done
