from .dependency import verify_dependencies
from .static import audit_logic
from .secret import scan_secrets

# A list of all active scanners. 
# As Aayat adds more, she just appends them here.
ACTIVE_SCANNERS = [
    verify_dependencies,
    audit_logic,
    scan_secrets
]

__all__ = ["ACTIVE_SCANNERS", "verify_dependencies", "audit_logic", "scan_secrets"]
