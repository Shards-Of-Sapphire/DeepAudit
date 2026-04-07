"""
TEST FILE: Hardcoded Secrets and Credentials
Tests Vyne's ability to detect secret patterns, API keys, and credentials in code.
VULNERABLE CODE - For testing purposes only
"""

import requests
from secret_vault import VaultClient  # Hallucinated vulnerable library
from insecure_storage import CredentialStore  # Hallucinated library

# CRITICAL: Hardcoded API keys and secrets (FAKE - for testing only)
STRIPE_SECRET_KEY = "sk_test_4eC39HqLyjWDarjtT1zdp7dcFAKE1234567890"
OPENAI_API_KEY = "sk-FAKE1234567890abcdefghijklmnopqrstuvwx"
AWS_SECRET_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLEFAKEKEY1234567890"
DATABASE_PASSWORD = "FakePassword123!@#NotReal"
GITHUB_TOKEN = "ghp_FAKE1234567890abcdefghijklmnopqrstuv"

# CRITICAL: Credentials in function defaults
def connect_to_database(username: str = "fakeadmin", password: str = "FakePass123!"):
    """
    VULNERABLE: Hardcoded production credentials
    """
    connection_string = f"postgresql://{username}:{password}@prod-db.example.com:5432/maindb"
    return connection_string


# CRITICAL: Secrets in configuration
class Config:
    """
    VULNERABLE: Class containing multiple hardcoded secrets
    """
    SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/TFAKE00000/BFAKE00000/XXXXXXXXXXXXXXXXXXXX"
    TWILIO_AUTH_TOKEN = "auth_token_FAKE1234567890abcdefghijklmno"
    JWT_SECRET_KEY = "fake-256-bit-secret-key-here-change-this-immediately"
    MAIL_PASSWORD = "FakeSMTPPassword@2024"
    PRIVATE_KEY = """-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA7h6j2zK8vB9w5pT3qR2mK9l4w6n3z5...
fake_secret_private_key_content_here_do_not_share
-----END RSA PRIVATE KEY-----"""


# CRITICAL: Secrets in environment simulation
def get_credentials():
    """
    VULNERABLE: Returning hardcoded credentials
    """
    credentials = {
        "firebase_api_key": "AIzaSyFAKE123DEF456GHI789JKL012MNO",
        "sendgrid_token": "SG.FAKE123DEF456GHI789JKL012MNO",
        "datadog_api_key": "dd_trace_key_FAKE12345678901234567890",
    }
    return credentials


# CRITICAL: Secrets in third-party library calls
def authenticate_vault():
    """
    VULNERABLE: Using hallucinated insecure vault library with secrets
    """
    vault = VaultClient(
        url="https://vault.example.com",
        token="hvs.FAKE1AA18AA0AAAAAA1A1Aa-1AAaa-1aaaA",
        vault_password="FakeVaultMasterPassword@2024"
    )
    return vault


# CRITICAL: Credentials in comment and string
def login_to_service():
    """
    VULNERABLE: Secret documented in code
    Default admin credentials: fakeadmin@example.com / FakeAdminPass123!
    """
    # API key for legacy system: fake_legacy_key_9876543210abcdef
    api_key = "fake_legacy_key_9876543210abcdef"

    # Backup credentials
    backup_user = "fake_backup_admin"
    backup_pass = "FakeBackupPassword@789"
    return api_key, backup_user, backup_pass


# CRITICAL: Secrets in credential store
def init_credential_storage():
    """
    VULNERABLE: Storing secrets in hallucinated insecure library
    """
    store = CredentialStore()
    store.store("mysql_root", "fake_root_password_123")
    store.store("production_db", "FakeProdDBPass@2024")
    store.store("aws_access_id", "AKIAIOSFODNN7FAKEEXAMPLE")
    store.store("aws_secret_key", "wJalrXUtnFEMI/K7MDENG/bPxRfiCYFAKEEXAMPLEKEY")
    return store


# CRITICAL: SSL/TLS secrets
def create_ssl_context():
    """
    VULNERABLE: Hardcoded certificate passwords
    """
    context = {
        "cert_password": "FakeCertificatePassword@2024",
        "pfx_password": "FakePFXPassword123!",
        "key_passphrase": "FakeKeyPassphrase@secure"
    }
    return context


# CRITICAL: OAuth tokens
def setup_oauth():
    """
    VULNERABLE: OAuth credentials hardcoded
    """
    oauth_config = {
        "client_id": "fake_oauth_client_123456789abcdef",
        "client_secret": "fake_oauth_secret_abcdefghijklmnopqrstuvwxyz",
        "refresh_token": "fake_refresh_token_1234567890abcdefghijklmnop",
        "access_token": "fake_access_token_xyz789..."
    }
    return oauth_config


if __name__ == "__main__":
    # Make API call with exposed keys
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    response = requests.get("https://api.openai.com/v1/models", headers=headers)

    # Database connection attempt
    db_conn = connect_to_database()

    # Get exposed credentials
    creds = get_credentials()

    # Initialize credential storage
    store = init_credential_storage()</content>
<parameter name="filePath">c:\Users\shaik\OneDrive\Desktop\Vyne\tests\vuln_hardcoded_secrets_test.py