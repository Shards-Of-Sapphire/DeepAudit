import sys
import importlib
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = PROJECT_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

REQUIRED_FILES = [
    "src/deepaudit/engine/parser.py",
    "src/deepaudit/scanners/__init__.py",
    "src/deepaudit/utils/logger.py",
    "src/deepaudit/utils/config.py",
    "config.yaml",
    "tests/bombard_test.py"
]

def check_dependencies():
    deps = ["dotenv", "requests", "rich", "tree_sitter", "tree_sitter_python", "yaml"]
    missing = []
    for d in deps:
        try:
            importlib.import_module(d)
        except ImportError:
            missing.append(d)
    return missing

def main():
    print("💎 Sapphire Collective: DeepAudit v0.2.0 Environment Check")
    print("-" * 50)
    
    # 1. Check Files
    all_files_present = True
    for f in REQUIRED_FILES:
        if (PROJECT_ROOT / f).exists():
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
        print(
            "     Run: pip install requests rich tree-sitter "
            "tree-sitter-python python-dotenv pyyaml"
        )

    try:
        import deepaudit  # noqa: F401
    except ImportError:
        print("[!!] Package import failed: deepaudit")
        all_files_present = False
    else:
        print("[OK] Package import succeeded: deepaudit")

    # 3. Final Verdict
    print("-" * 50)
    if all_files_present and not missing_deps:
        print("STATUS: READY")
        sys.exit(0)
    else:
        print("STATUS: ENVIRONMENT INCOMPLETE")
        sys.exit(1)

if __name__ == "__main__":
    main()
