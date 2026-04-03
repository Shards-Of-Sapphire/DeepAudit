# 🛠️ DeepAudit Internal Tools: The Construction Crew

The `tools/` directory is strictly for the developers building DeepAudit. The scripts in here do not scan code for vulnerabilities; they manage our project's infrastructure. 

## The Autodoc Pipeline (Documentation as Code)
As developers, we hate writing and updating documentation manually. It always gets outdated. To solve this, DeepAudit writes its own documentation!

* **`autodoc.py` (The Blueprint Maker):** This script reads all the code we write in `src/deepaudit/`. It uses Python's built-in tools to find every `class` and `def` function we create, and it extracts the comments (docstrings) we write under them. It is strictly programmed to fail the build if we forget to document a public function!
* **`renderer.py` (The Formatter):** Once `autodoc.py` gathers all our comments, it hands them to the renderer. The renderer perfectly formats that information into the `API_CODEX.md` file using strict Markdown rules. 

**The Result:** Every time we change how DeepAudit works, we just run `python tools/autodoc.py`, and our team's rulebook is instantly updated.