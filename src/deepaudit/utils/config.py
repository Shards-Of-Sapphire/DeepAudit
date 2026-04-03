<<<<<<< HEAD
import os
from pathlib import Path

import yaml
from dotenv import load_dotenv

class ConfigManager:
    def __init__(self, config_path="config.yaml"):
        self.path = Path(config_path)
        # 1. Standard Library Baseline (The "Safe" Python Modules)
        self.std_lib = {
            "sys", "os", "pathlib", "time", "json", "typing", 
            "logging", "abc", "math", "collections", "re"
        }
        self.data = self._load()

    def _load(self):
        if not self.path.exists():
            return {"whitelist": [], "scanners": {}}
        with open(self.path, "r") as f:
            return yaml.safe_load(f)

    def get_trusted_namespaces(self):
        """
        Returns a unified set of:
        Internal Folders + Standard Lib + User config.yaml
        """
        internal = {"deepaudit", "src", "engine", "scanners", "utils"}
        user_defined = set(self.data.get("whitelist", []))
        
        # Combine everything into one master set
        return internal | self.std_lib | user_defined
    
# Automatically find the .env file in the project root
env_path = Path(__file__).resolve().parent.parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

def get_config(key, default=None):
    """Safely retrieve environment variables."""
    return os.getenv(key, default)

# Pre-defined helpers for DeepAudit
def is_debug():
    return str(get_config("DEBUG", "False")).lower() == "true"

def get_pypi_token():
    return get_config("PYPI_TOKEN")
=======
from ..deepaudit.utils.config import (
    ConfigManager,
    get_config,
    get_pypi_token,
    is_debug,
)

__all__ = ["ConfigManager", "get_config", "is_debug", "get_pypi_token"]
>>>>>>> ba8e9ed80daf1e7830b688e8357da3c9ccf9ca6d
