# src/vyne/scanners/dependency.py

def scan(ast_node, raw_code: str, file_path: str) -> list[dict]:
    """Scans for known hallucinated or dangerous AI dependencies."""
    findings = []
    
    # A localized blacklist of libraries LLMs frequently hallucinate
    HALLUCINATED_LIBS = {"sk_crypto", "openai_auth", "auto_gpt_core", "xyz_telemetry"}
    
    lines = raw_code.splitlines()
    for i, line in enumerate(lines):
        line_clean = line.strip()
        
        # Quick check for import statements
        if line_clean.startswith("import ") or line_clean.startswith("from "):
            for fake_lib in HALLUCINATED_LIBS:
                if fake_lib in line_clean:
                    findings.append({
                        "scanner": "DependencyScanner",
                        "severity": "CRITICAL",
                        "line": i + 1,
                        "message": f"Hallucinated library detected: '{fake_lib}'",
                        "snippet": line_clean
                    })
                    
    return findings
