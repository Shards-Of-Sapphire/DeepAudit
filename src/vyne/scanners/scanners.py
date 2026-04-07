import pkgutil
import importlib
from pathlib import Path
from typing import List, Dict, Any, Callable

from ..utils.logger import get_logger

logger = get_logger("REGISTRY")

class ScannerRegistry:
    """
    The central execution hub for Vyne's security modules.
    
    This registry dynamically discovers and loads all standalone scanners 
    (e.g., dependency, secret, static) residing in the scanners directory. 
    It ensures that new vulnerability checks can be added to the flagship 
    without modifying the core execution loop.
    """

    def __init__(self):
        """Initializes the registry and maps all available scanners."""
        self.scanners: List[Callable] = self._discover_scanners()

    def _discover_scanners(self) -> List[Callable]:
        """
        Recursively walks the scanners namespace and extracts the execution hooks.
        
        A valid scanner module must expose a public `scan(ast_node, raw_code)` function.
        
        Returns:
            List[Callable]: A list of function pointers to the active scanners.
        """
        active_hooks = []
        # Get the directory of the current file (__file__)
        package_dir = Path(__file__).resolve().parent
        
        logger.debug(f"Scanning namespace for security modules in: {package_dir.name}")

        for _, module_name, is_pkg in pkgutil.walk_packages([str(package_dir)]):
            # Ignore sub-packages and the registry itself
            if is_pkg or module_name in ["scanners", "base"]:
                continue

            try:
                # Dynamically import the module (e.g., 'vyne.scanners.secret')
                module = importlib.import_module(f"vyne.scanners.{module_name}")
                
                # Enforce the Scanner Contract: Must have a 'scan' function
                if hasattr(module, "scan") and callable(module.scan):
                    active_hooks.append(module.scan)
                    logger.debug(f"Loaded scanner module: {module_name}")
                else:
                    logger.warning(f"Module '{module_name}' missing 'scan()' hook. Ignored.")
                    
            except Exception as e:
                logger.error(f"Failed to load scanner '{module_name}': {e}")

        return active_hooks

    def run_all(self, ast_node: Any, raw_code: str, file_path: str) -> List[Dict[str, Any]]:
        """
        Pipes the parsed AST through every registered security scanner.

        Args:
            ast_node (Any): The root Tree-sitter node of the parsed file.
            raw_code (str): The raw source code as a string.
            file_path (str): The absolute path to the file being audited.

        Returns:
            List[Dict[str, Any]]: An aggregated list of all vulnerabilities found.
        """
        all_findings = []
        
        if not self.scanners:
            logger.warning("No active scanners found in the registry!")
            return all_findings

        for scan_func in self.scanners:
            try:
                # Execute the scanner and extend the master findings list
                findings = scan_func(ast_node, raw_code, file_path)
                if findings:
                    all_findings.extend(findings)
            except Exception as e:
                logger.error(f"Scanner crash on {file_path}: {e}")

        return all_findings
