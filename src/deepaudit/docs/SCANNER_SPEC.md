<<<<<<< HEAD
## 🛡️ DeepAudit Scanner Specification (v0.2.0)
=======
## 🛡️ DeepAudit Scanner Specification (v0.4.1)
>>>>>>> ba8e9ed80daf1e7830b688e8357da3c9ccf9ca6d
The Scanner Registry is a modular "plugin" system. Its purpose is to take the structured data provided by the Tree-sitter Engine and apply security heuristics to find vulnerabilities.

*1. The Scanner Interface*
Every scanner in the src/deepaudit/scanners/ directory must follow a strict functional contract. This ensures the CLI can call any scanner without knowing its internal logic.

Input: A single dictionary named metadata.

Output: A list of dictionaries, where each dictionary represents a "Finding."

The Metadata Object (Input)
The metadata dictionary provided by the engine contains:

raw_code: The entire source code as a str.

libraries: A list of strings representing imported modules.

root: The Tree-sitter Node object representing the top of the syntax tree.

*2. Active Scanners & Logic*
A. Dependency Shield (dependency.py)
Logic: Performs a "Hallucination Check." It iterates through metadata['libraries'] and pings a cached version of the PyPI registry.

Severity: CRITICAL if a library doesn't exist (likely an AI hallucination).

Current Constraint: Needs a "Standard Library Whitelist" to avoid flagging built-in modules like os or math.

B. Secret Scanner (secret.py)
Logic: High-entropy string detection. It uses re.finditer on metadata['raw_code'].

Patterns: Looks for assignments where the variable name contains "key", "token", or "secret" followed by a string of 16+ characters.

Severity: CRITICAL. Hardcoded secrets are the #1 cause of cloud breaches in AI-generated deployments.

C. Static Auditor (static.py)
Logic: AST-based dangerous function detection. It traverses metadata['root'] looking for call nodes where the function identifier is eval, exec, or os.system.

Severity: HIGH. These functions allow AI-generated code to execute arbitrary commands on the host machine.

*3. The "Sapphire" Finding Format*
To keep the UI consistent, every scanner must return findings in this exact structure:

```Python
{
    "severity": "CRITICAL", # Options: CRITICAL, HIGH, MEDIUM, LOW
    "issue": "Detailed description of the vulnerability",
    "fix": "Specific steps the developer should take to resolve it"
}
```
*4. Registry & Integration (__init__.py)*
The __init__.py file in the scanners folder acts as the Central Dispatch. It prevents the CLI from having to import 50 different files.

```Python
# src/deepaudit/scanners/__init__.py
from .dependency import verify_dependencies
from .secret import scan_for_secrets
from .static import audit_static_calls
```

# The Director's Control List
ACTIVE_SCANNERS = [
    verify_dependencies,
    scan_for_secrets,
    audit_static_calls
]

### 5. Developer Responsibilities (Aayat & Uzma)
    Task	                Owner	        Duty
Heuristic Design	        Aayat	        Researching new AI attack vectors (like "Prompt Injection" via code).
Regex Optimization	        Aayat	        Ensuring the Secret Scanner doesn't lag on large files.
False Positive Audit	    Uzma	        Testing scanners against real-world, safe libraries to ensure no "spam" alerts.
Edge Case Injection	        Uzma	        Creating "Malicious" test files to ensure scanners actually fire.