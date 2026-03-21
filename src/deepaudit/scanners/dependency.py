import requests

def verify_dependencies(metadata):
    """
    Checks if libraries exist on PyPI. 
    Returns a list of finding dictionaries.
    """
    findings = []
    
    for lib in metadata['libraries']:
        response = requests.get(f"https://pypi.org/pypi/{lib}/json")
        
        if response.status_code == 404:
            findings.append({
                "severity": "CRITICAL",
                "issue": f"Hallucinated Library Detected: '{lib}'",
                "fix": f"Remove '{lib}' or check for typos. This package does not exist on PyPI."
            })
            
    return findings