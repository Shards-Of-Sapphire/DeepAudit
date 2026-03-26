import argparse
from pathlib import Path
from typing import Iterable

from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table

from deepaudit import VERSION
from deepaudit.engine.parser import CodeParser
from deepaudit.engine.parser import CodeParser
from deepaudit.scanners.scanners import ScannerRegistry

console = Console()
registry = ScannerRegistry()

def display_header() -> None:
    """Render the CLI header."""
    console.print(
        Panel.fit(
            f"[bold blue]SAPPHIRE[/bold blue]\n"
            f"[bold white]DeepAudit v{VERSION}[/bold white]\n"
            f"[dim]The X-Ray for AI-Generated Code[/dim]",
            border_style="blue",
            padding=(1, 4),
        )
    )


def _build_results_table(target_name: str) -> Table:
    table = Table(
        title=f"Security Audit: {target_name}",
        show_header=True,
        header_style="bold magenta",
    )
    table.add_column("Severity", width=12)
    table.add_column("Issue", style="white")
    table.add_column("Recommended Fix", style="green")
    return table


def _render_findings(results_table: Table, findings_by_scanner: Iterable[list[dict]]) -> int:
    findings_count = 0
    for findings in findings_by_scanner:
        for issue in findings:
            severity = issue.get("severity", "INFO")
            severity_color = {
                "CRITICAL": "bold red",
                "HIGH": "red",
                "MEDIUM": "yellow",
                "LOW": "blue",
            }.get(severity, "white")
            results_table.add_row(
                f"[{severity_color}]{severity}[/{severity_color}]",
                issue.get("issue", "Unknown issue"),
                issue.get("fix", "No remediation provided."),
            )
            findings_count += 1
    return findings_count


def run_audit(file_path: str) -> int:
    target = Path(file_path)
    if not target.exists() or not target.is_file():
        console.print(f"[bold red]Error:[/bold red] File {file_path} not found.")
        return 1

    display_header()

    # 1. Parsing Phase
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        transient=True,
    ) as progress:
        progress.add_task(description="Parsing source...", total=None)
        
        parser = CodeParser(str(target))
        # v0.3.0 Standard: Extracting AST and Raw Code for the new registry signature
        ast_root = parser.parse()
        with open(target, "r", encoding="utf-8") as f:
            raw_code = f.read()

    results_table = _build_results_table(target.name)
    findings_by_scanner: list[list[dict]] = []

    # 2. Scanning Phase (Dynamic Registry Integration)
    with Progress(transient=True) as progress:
        task = progress.add_task(
            "[cyan]Scanning for vulnerabilities...",
            total=len(registry.scanners),
        )
        
        for scanner_func in registry.scanners:
            try:
                # Execute the dynamic hook: scan(ast_node, raw_code, file_path)
                findings = scanner_func(ast_root, raw_code, str(target))
                
                # Keep the nested list structure for _render_findings
                if findings:
                    findings_by_scanner.append(findings)
            except Exception as e:
                console.print(f"[bold yellow]Warning:[/bold yellow] Scanner module crashed - {e}")
                
            progress.advance(task)

    # 3. Rendering Phase
    findings_count = _render_findings(results_table, findings_by_scanner)
    if findings_count > 0:
        console.print(results_table)
        console.print(
            f"\n[bold red]Audit Failed:[/bold red] Found {findings_count} potential risks."
        )
        return 1

    console.print(
        "\n[bold green]Audit Passed:[/bold green] No major hallucinations or leaks detected."
    )
    return 0

def main() -> int:
    parser = argparse.ArgumentParser(description="DeepAudit CLI")
    parser.add_argument("file", help="Path to the Python file to audit")
    parser.add_argument(
        "-v",
        "--version",
        action="version",
        version=f"DeepAudit {VERSION}",
    )
    args = parser.parse_args()
    return run_audit(args.file)


if __name__ == "__main__":
    raise SystemExit(main())
