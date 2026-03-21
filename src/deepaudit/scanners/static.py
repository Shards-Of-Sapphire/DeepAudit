def audit_logic(metadata):
    """
    Placeholder for Aayat's logic scanner.
    Currently looking for eval() and exec() calls.
    """
    findings = []
    code = metadata.get('raw_code', '')
    
    # Simple check for demo purposes
    if "eval(" in code or "exec(" in code:
        findings.append({
            "severity": "HIGH",
            "issue": "Dangerous Execution: 'eval' or 'exec' detected.",
            "fix": "Avoid dynamic execution of AI-generated strings. Use safer alternatives."
        })
        
    return findings