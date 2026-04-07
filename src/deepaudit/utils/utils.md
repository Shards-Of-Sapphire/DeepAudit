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
