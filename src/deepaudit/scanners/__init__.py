<<<<<<< HEAD
from .dependency import verify_dependencies
from .static import audit_logic
from .secret import scan_for_secrets

# A list of all active scanners. 
# As Aayat adds more, she just appends them here.
ACTIVE_SCANNERS = [
    verify_dependencies,
    audit_logic,
    scan_for_secrets
]

__all__ = ["ACTIVE_SCANNERS", "verify_dependencies", "audit_logic", "scan_for_secrets"]
=======
"""
DeepAudit Dynamic Scanners Namespace.
Scanners are auto-discovered by the ScannerRegistry in scanners.py.
"""
>>>>>>> ba8e9ed80daf1e7830b688e8357da3c9ccf9ca6d
