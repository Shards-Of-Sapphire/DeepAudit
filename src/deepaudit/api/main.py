# src/deepaudit/api/main.py
import tempfile
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from deepaudit.engine.parser import CodeParser
from deepaudit.scanners.scanners import ScannerRegistry

# Initialize the FastAPI application
app = FastAPI(
    title="DeepAudit API",
    description="The Safe-Guard AI Audit Engine by Sapphire Collective.",
    version="0.3.0"
)

# Define the expected JSON payload from the user/dashboard
class AuditRequest(BaseModel):
    code: str
    filename: str = "snippet.py"

@app.post("/api/v1/scan")
async def scan_code(request: AuditRequest):
    """
    Receives raw code via HTTP POST, audits it using the localized 
    DeepAudit engine, and returns the findings as pure JSON.
    """
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="No code provided.")

    findings_list = []
    
    # 1. Create an isolated, temporary file for the CodeParser
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as temp_file:
        temp_file.write(request.code)
        temp_path = temp_file.name

    try:
        # 2. Boot the v0.3.0 Engine Pipeline
        parser = CodeParser(temp_path)
        ast_root = parser.parse()
        
        # We boot a local registry per request to avoid data bleed (Phase 1 standard)
        registry = ScannerRegistry()
        
        # 3. Execute the Scanners
        findings_by_scanner = registry.run_all(ast_root, request.code, request.filename)
        
        # Flatten the nested list so it's a clean JSON array for the web dashboard
        for scanner_findings in findings_by_scanner:
            findings_list.extend(scanner_findings)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Engine failure: {str(e)}")
    
    finally:
        # 4. ALWAYS clean up the temporary file so the server disk doesn't fill up
        if os.path.exists(temp_path):
            os.remove(temp_path)

    # 5. Return the structured data to the frontend
    return {
        "status": "success",
        "file_audited": request.filename,
        "total_risks": len(findings_list),
        "findings": findings_list
    }

if __name__ == "__main__":
    import uvicorn
    # Boot the server locally on port 8000
    uvicorn.run(app, host="127.0.0.1", port=8000)