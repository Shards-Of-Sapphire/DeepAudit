import sys
import argparse
from pathlib import Path

# Sapphire Creative UI Imports
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn

# Backend & Versioning Imports
from deepaudit import VERSION
from deepaudit.engine.parser import CodeParser
from deepaudit.scanners import ACTIVE_SCANNERS

console = Console()

def display_header():
    """Roushna's Sapphire-branded header"""
    console.print(
        Panel.fit(
            f"[bold blue]💎 SAPPHIRE COLLECTIVE[/bold blue]\n"
            f"[bold white]DeepAudit v{VERSION}[/bold white]\n"
            f"[dim]The X-Ray for AI-Generated Code[/dim]",
            border_style="blue",
            padding=(1, 4)
        )
    )

def run_audit(file_path: str):
    target = Path(file_path)
    
    if not target.exists():
        console.print(f"[bold red]Error:[/bold red] File {file_path} not found.")
        sys.exit(1)

    display_header()
    
    # 1. Initialize Shoaib's Engine
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        transient=True,
    ) as progress:
        progress.add_task(description="Parsing AST with Tree-sitter...", total=None)
        parser = CodeParser(target)
        metadata = parser.get_metadata()

    # 2. Run Aayat's Scanner Loop
    results_table = Table(title=f"🔍 Security Audit: {target.name}", show_header=True, header_style="bold magenta")
    results_table.add_column("Severity", width=12)
    results_table.add_column("Issue", style="white")
    results_table.add_column("Recommended Fix", style="green")

    findings_count = 0

    with Progress(transient=True) as progress:
        task = progress.add_task("[cyan]Scanning for vulnerabilities...", total=len(ACTIVE_SCANNERS))
        
        for scanner_func in ACTIVE_SCANNERS:
            findings = scanner_func(metadata)
            for issue in findings:
                # Severity-based coloring
                severity_color = {
                    "CRITICAL": "bold red",
                    "HIGH": "red",
                    "MEDIUM": "yellow",
                    "LOW": "blue"
                }.get(issue['severity'], "white")

                results_table.add_row(
                    f"[{severity_color}]{issue['severity']}[/{severity_color}]",
                    issue['issue'],
                    issue['fix']
                )
                findings_count += 1
            progress.advance(task)

    # 3. Final Report
    if findings_count > 0:
        console.print(results_table)
        console.print(f"\n[bold red]✖ Audit Failed:[/bold red] Found {findings_count} potential risks.")
    else:
        console.print("\n[bold green]✔ Audit Passed:[/bold green] No major hallucinations or leaks detected.")

def main():
    parser = argparse.ArgumentParser(description="DeepAudit CLI")
    parser.add_argument("file", help="Path to the Python file to audit")
    parser.add_argument("-v", "--version", action="version", version=f"DeepAudit {VERSION}")
    
    args = parser.parse_args()
    run_audit(args.file)

if __name__ == "__main__":
    main()