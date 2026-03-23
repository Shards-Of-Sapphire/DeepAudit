### Scanners Module (src/scanners/)
The security logic layer where AST nodes are evaluated against vulnerability patterns.

# Key Features:
*Explicit Manifest Registry* : Uses a "Central Dispatch" pattern in scanners/__init__.py. The ACTIVE_SCANNERS list serves as the single source of truth for execution order and oversight.

*Hardcoded Secret Detection* : Scans string_literal nodes for patterns matching API keys, tokens, and credentials, utilizing syntax context to ignore comments or documentation.

*Dependency Auditing* : Inspects import statements and package declarations to identify deprecated or "fake" dependencies that pose a supply-chain risk.

*Standardized Findings* : Every scanner returns a uniform object containing severity, line-range, and remediation steps, ensuring consistent reporting across the Sapphire ecosystem.