from .deepaudit.cli import main, run_audit

__all__ = ["main", "run_audit"]


if __name__ == "__main__":
    raise SystemExit(main())
