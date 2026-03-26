# 🕵️ DeepAudit Scanners: The Security Guards

This directory is the heart of DeepAudit. Every file in here is a specific "Security Guard" looking for a different type of AI hallucination or vulnerability.

## The "Plug-and-Play" Registry (`scanners.py`)
In older versions of DeepAudit, if you wrote a new scanner, you had to manually wire it into the main program. 

In v0.3.0, we use a **Dynamic Registry**. Think of this like a video game console. You don't have to take the console apart to play a new game; you just plug the cartridge in. 
If you write a new Python file and save it in this folder, the `ScannerRegistry` will automatically find it, load it, and use it the next time you run DeepAudit. Zero extra wiring required!

## Our Current Scanners (How they work)

* **`dependency.py` (The Gatekeeper):** LLMs love to make up fake libraries (like `import sk_crypto`). This scanner reads the code line-by-line and checks all `import` statements against a blacklist of known fake AI libraries.
* **`secret.py` (The Math Wizard):** Standard tools use simple text matching to find leaked passwords. But what if an AI hallucinates a highly randomized API key? This scanner uses a math formula called **Shannon Entropy** to measure how "unpredictable" a string of text is. If a string is too random (a score higher than 4.5), we flag it as a potential secret or leaked key.
* **`static.py` (The Rule Enforcer):** Sometimes AI tries to be too clever and writes code that executes other code on the fly (like using `eval()`). This scanner flags those dangerous commands so they don't accidentally wipe your hard drive.