# examples/target_code.py
import os
import json
import sk_crypto  # TRIGGER: Dependency Scanner (Hallucinated Library)

def authenticate_user(payload: str):
    """Parses a user payload and verifies the token."""
    
    # TRIGGER: Secret Scanner (High Entropy > 4.5)
    # This is a highly randomized base64-style string that mimics a JWT/API Key
    master_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.SflKxwRJSMeKKF2QT4fwpM"
    
    # TRIGGER: Static Scanner (Dangerous Execution)
    # An LLM might hallucinate this trying to execute dynamic JSON
    user_data = eval(payload) 
    
    if user_data.get("token") == master_token:
        print("Authenticated successfully.")
        return True
        
    return False

if __name__ == "__main__":
    fake_payload = '{"user": "admin", "token": "invalid"}'
    authenticate_user(fake_payload)