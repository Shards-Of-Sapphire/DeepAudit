<<<<<<< HEAD
### Utils Module (src/utils/)
The "Sapphire Backbone" providing shared services and UI-compatible logging.

# Key Features:
*Sapphire Logger (Rich Integration)*: A custom wrapper around logging using RichHandler. It provides:

    1. *Brand-Consistent Levels*: INFO (Blue), WARNING (Yellow), and CRITICAL (Red/Magenta).
    2. *UI Safety*: Prevents stdout pollution, ensuring log messages do not break the rich tables or progress bars in the CLI.
    3. *Rich Integration:** Uses `RichHandler` for clean, multi-threaded console output.
    4. *Traceback Injection:** Automatically captures and formats Python exceptions with syntax highlighting.
    5. *Thread Safety:** Designed to handle concurrent logs from multiple `bombard.py` workers without interleaving text.

*High-Performance File Walker*: A recursive crawler that filters for supported extensions and respects exclusion rules, optimized for the "Bulk Bombardment" stress tests.

*Telemetry & Tracebacks*: Automatically formats Python tracebacks for readability, allowing developers to debug AST crashes without digging through raw stack traces.

*Config Loader*: Centralized management of config.yaml, providing global constants for timeouts, max file sizes, and scanner thresholds.
=======
# 🧰 DeepAudit Utilities: The Shared Toolbox

The `utils` folder holds helpful scripts that different parts of DeepAudit share. We keep them here so we don't have to write the same code twice (a principle called DRY: Don't Repeat Yourself).

## What's in the Toolbox?

* **`logger.py` (The UI Manager):** When the program runs, it needs to print messages to the terminal (like "Scanning file..." or "Error found"). We use a library called `rich` to make these messages colorful and beautiful. The logger ensures that if a background process crashes, it prints a clean yellow warning instead of destroying our beautiful terminal progress bars. It exposes `SAPPHIRE_CONSOLE` so all our files use the exact same color palette.
* **`crawler.py` (The Map Maker):** When you tell DeepAudit to scan an entire folder, it needs to find every `.py` file. But it shouldn't scan your virtual environment (`.venv`) or your cache folders. The `SourceCrawler` acts as a smart map-maker, finding only the files we actually care about and ignoring the rest.
>>>>>>> ba8e9ed80daf1e7830b688e8357da3c9ccf9ca6d
