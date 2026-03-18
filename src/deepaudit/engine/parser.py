import re

def extract_metadata(code_content):
    """Extracts library imports and function definitions from raw code."""
    # Find all 'import x' or 'from x import y'
    import_pattern = r"^(?:from\s+([\w\.]+)\s+)?import\s+([\w\.,\s]+)$"
    # Find function definitions to check for 'Logic'
    func_pattern = r"def\s+(\w+)\s*\(.*\):"

    imports = []
    matches = re.findall(import_pattern, code_content, re.MULTILINE)
    for m in matches:
        # Capture the base package name
        lib = m[0] if m[0] else m[1].split(',')[0].strip().split(' ')[0]
        imports.append(lib.split('.')[0])

    functions = re.findall(func_pattern, code_content)
    
    return {
        "libraries": list(set(imports)),
        "functions": functions
    }
