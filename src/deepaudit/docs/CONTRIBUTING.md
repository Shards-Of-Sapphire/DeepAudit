# Contributing to DeepAudit

## 1. Branching Strategy
- `main`: Production-ready, stable releases (v0.1.0, etc.).
- `dev`: Active feature development.
- `feature/[name]`: Experimental features (e.g., `feature/aquarium-sandbox`).

## 2. Review Process
1. Create a Pull Request (PR) from your feature branch to `dev`.
2. Ensure `pytest` passes 100%.
3. **Lead Approval:** Zayed (Lead Architect) must review the AST logic.
4. **Backend Approval:** Shoaib (Backend Control) must verify the execution flow.

## 3. Code Quality
- Use **Type Hinting** for all new functions.
- Document every class and module.
- Never hardcode API keys or system paths.
