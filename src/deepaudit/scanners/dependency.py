<<<<<<< HEAD
import logging
import sys

import requests

from deepaudit.utils.config import ConfigManager, get_config

logger = logging.getLogger("Scanner.Deps")
config = ConfigManager()
TRUSTED = config.get_trusted_namespaces()

config = ConfigManager()
TRUSTED_NAMESPACES = config.get_trusted_namespaces()
STD_LIB_WHITELIST = set(sys.stdlib_module_names)

def verify_dependencies(metadata):
    """
    Checks if libraries exist on PyPI. 
    Returns a list of finding dictionaries.
    """
    findings = []
    import_list = metadata.get('libraries', [])

    for lib in import_list:
        # 1. Normalize the library name (e.g., 'rich.table' -> 'rich')
        # We use .split('.')[0] to get the root namespace
        root_name = lib.split('.')[0]

        # 2. Consolidated Whitelist Check
        # Combines Config Whitelist, Internal Namespaces, and Std-Lib
        if root_name in TRUSTED_NAMESPACES or root_name in STD_LIB_WHITELIST:
            continue  # Skip to next library, this one is safe.

        # 3. Proceed to Hallucination/Security check
        # ...

            response = requests.get(f"https://pypi.org/pypi/{lib}/json")

            if response.status_code == 404:
                findings.append({
                    "severity": "CRITICAL",
                    "issue": f"Hallucinated Library Detected: '{lib}'",
                    "fix": f"Remove '{lib}' or check for typos. This package does not exist on PyPI."
                })

        return findings
=======
# src/deepaudit/scanners/dependency.py

def scan(ast_node, raw_code: str, file_path: str) -> list[dict]:
    """Scans for known hallucinated or dangerous AI dependencies."""
    findings = []
    
    # A localized blacklist of libraries LLMs frequently hallucinate
    HALLUCINATED_LIBS = {"sk_crypto", "openai_auth", "auto_gpt_core", "xyz_telemetry"}
    
    lines = raw_code.splitlines()
    for i, line in enumerate(lines):
        line_clean = line.strip()
        
        # Quick check for import statements
        if line_clean.startswith("import ") or line_clean.startswith("from "):
            for fake_lib in HALLUCINATED_LIBS:
                if fake_lib in line_clean:
                    findings.append({
                        "scanner": "DependencyScanner",
                        "severity": "CRITICAL",
                        "line": i + 1,
                        "message": f"Hallucinated library detected: '{fake_lib}'",
                        "snippet": line_clean
                    })
                    
    return findings
>>>>>>> ba8e9ed80daf1e7830b688e8357da3c9ccf9ca6d
