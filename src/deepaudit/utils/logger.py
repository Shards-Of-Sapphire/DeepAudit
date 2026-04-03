<<<<<<< HEAD
=======
# src/deepaudit/utils/logger.py
>>>>>>> ba8e9ed80daf1e7830b688e8357da3c9ccf9ca6d
import logging
from rich.logging import RichHandler
from rich.console import Console

# Sapphire Brand Palette
SAPPHIRE_CONSOLE = Console()

def get_logger(name: str):
    """
    Returns a Rich-integrated logger.
<<<<<<< HEAD
    Ensures backend modules (Engine/Scanners) don't break the UI.
=======
    Ensures backend modules don't break the UI.
>>>>>>> ba8e9ed80daf1e7830b688e8357da3c9ccf9ca6d
    """
    logger = logging.getLogger(name)
    
    # Avoid duplicate handlers if get_logger is called multiple times
    if not logger.handlers:
        handler = RichHandler(
            console=SAPPHIRE_CONSOLE,
<<<<<<< HEAD
            rich_tracebacks=True, # Beautiful Sapphire-style tracebacks
=======
            rich_tracebacks=True,
>>>>>>> ba8e9ed80daf1e7830b688e8357da3c9ccf9ca6d
            markup=True,
            show_path=False
        )
        
        # Define the Sapphire Format
        formatter = logging.Formatter(
            fmt="%(name)s - %(message)s",
            datefmt="[%X]"
        )
        
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        
    return logger