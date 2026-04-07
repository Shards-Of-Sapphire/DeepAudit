# src/vyne/scanners/secret.py
import math
import re

def _shannon_entropy(data: str) -> float:
    """Calculates the Shannon Entropy of a string to detect randomness."""
    if not data:
        return 0.0
    entropy = 0.0
    for x in set(data):
        p_x = float(data.count(x)) / len(data)
        entropy -= p_x * math.log2(p_x)
    return entropy

def scan(ast_node, raw_code: str, file_path: str) -> list[dict]:
    """Scans for high-entropy strings indicating hallucinated or leaked secrets."""
    findings = []
    
    # Regex to extract standard string literals (single or double quotes)
    string_pattern = re.compile(r'["\'](.*?)["\']')
    
    lines = raw_code.splitlines()
    for i, line in enumerate(lines):
        # Ignore comments to prevent false positives
        if line.strip().startswith("#"):
            continue
            
        matches = string_pattern.findall(line)
        for match in matches:
            # Target strings long enough to be keys, without spaces (not regular sentences)
            if len(match) > 16 and " " not in match:
                entropy = _shannon_entropy(match)
                
                # Threshold of 4.5 catches highly randomized base64/hex strings
                if entropy > 4.5:
                    findings.append({
                        "scanner": "SecretScanner",
                        "severity": "CRITICAL",
                        "line": i + 1,
                        "message": f"High entropy string detected (H={entropy:.2f}). Possible secret.",
                        "snippet": line.strip()
                    })
    return findings