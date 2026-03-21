import re

def scan_for_secrets(metadata):
    """
    Scans the raw source code for high-entropy strings (API Keys, Secrets).
    """
    # 1. THE FIX: Extract the string from the metadata dictionary
    code_content = metadata.get('raw_code', '')
    
    findings = []
    
    # Example Regex for Generic API Keys
    # (In a real scenario, Aayat would add specialized patterns for AWS, GitHub, etc.)
    SECRET_PATTERNS = {
        "Generic API Key": r'(?:key|api|token|secret|password|passwd|auth)[_-]?\w*[:=]\s*["\']([A-Za-z0-9/+=]{16,})["\']',
        "GitHub Token": r'ghp_[a-zA-Z0-9]{36}',
    }

    for label, regex in SECRET_PATTERNS.items():
        # Now code_content is a string, so re.finditer will be happy
        matches = re.finditer(regex, code_content, re.IGNORECASE)
        
        for match in matches:
            findings.append({
                "severity": "CRITICAL",
                "issue": f"Potential {label} exposed: '{match.group(0)[:10]}...'",
                "fix": "Move secrets to an .env file and use a library like 'python-dotenv'."
            })
            
    return findings