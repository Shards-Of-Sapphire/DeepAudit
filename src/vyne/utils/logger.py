# src/vyne/utils/logger.py
import logging
from rich.logging import RichHandler
from rich.console import Console

# Shared Vyne console
VYNE_CONSOLE = Console()

def get_logger(name: str):
    """
    Returns a Rich-integrated logger.
    Ensures backend modules don't break the UI.
    """
    logger = logging.getLogger(name)
    
    # Avoid duplicate handlers if get_logger is called multiple times
    if not logger.handlers:
        handler = RichHandler(
            console=VYNE_CONSOLE,
            rich_tracebacks=True,
            markup=True,
            show_path=False
        )
        
        # Define the shared console format
        formatter = logging.Formatter(
            fmt="%(name)s - %(message)s",
            datefmt="[%X]"
        )
        
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        
    return logger
