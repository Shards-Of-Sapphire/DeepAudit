# 🧰 DeepAudit Utilities: The Shared Toolbox

The `utils` folder holds helpful scripts that different parts of DeepAudit share. We keep them here so we don't have to write the same code twice (a principle called DRY: Don't Repeat Yourself).

## What's in the Toolbox?

* **`logger.py` (The UI Manager):** When the program runs, it needs to print messages to the terminal (like "Scanning file..." or "Error found"). We use a library called `rich` to make these messages colorful and beautiful. The logger ensures that if a background process crashes, it prints a clean yellow warning instead of destroying our beautiful terminal progress bars. It exposes `SAPPHIRE_CONSOLE` so all our files use the exact same color palette.
* **`crawler.py` (The Map Maker):** When you tell DeepAudit to scan an entire folder, it needs to find every `.py` file. But it shouldn't scan your virtual environment (`.venv`) or your cache folders. The `SourceCrawler` acts as a smart map-maker, finding only the files we actually care about and ignoring the rest.