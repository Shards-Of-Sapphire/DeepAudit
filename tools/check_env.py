import os
import sys
import importlib
from pathlib import Path

# Add src to path for direct execution check
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

REQUIRED_FILES = [
    "src/deepaudit/engine/parser.py",
    "src/deepaudit/scanners/__init__.py",
    "src/deepaudit/utils/logger.py",
    "src/deepaudit/utils/config.py",
    "config.yaml",
    "tests/bombard_test.py"
]

def check_dependencies():
    deps = ["rich", "tree_sitter", "tree_sitter_python", "psutil", "yaml"]
    missing = []
    for d in deps:
        try:
            importlib.import_module(d if d != "yaml" else "yaml")
        except ImportError:
            missing.append(d)
    return missing

def main():
    print("💎 Sapphire Collective: DeepAudit v0.2.0 Environment Check")
    print("-" * 50)
    
    # 1. Check Files
    all_files_present = True
    for f in REQUIRED_FILES:
        if Path(f).exists():
            print(f"[OK] Found: {f}")
        else:
            print(f"[!!] MISSING: {f}")
            all_files_present = False

    # 2. Check Dependencies
    missing_deps = check_dependencies()
    if not missing_deps:
        print("[OK] All Python dependencies installed.")
    else:
        print(f"[!!] MISSING DEPS: {', '.join(missing_deps)}")
        print("     Run: pip install rich tree-sitter tree-sitter-python psutil pyyaml")

    # 3. Final Verdict
    print("-" * 50)
    if all_files_present and not missing_deps:
        print("🚀 STATUS: READY FOR BOMBARDMENT")
        sys.exit(0)
    else:
        print("❌ STATUS: ENVIRONMENT INCOMPLETE")
        sys.exit(1)

if __name__ == "__main__":
    main()