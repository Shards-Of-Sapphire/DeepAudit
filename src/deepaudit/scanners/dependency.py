import logging
import sys

import requests

from src.deepaudit.utils.config import ConfigManager, get_config

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
