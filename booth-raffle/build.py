#!/usr/bin/env python3
"""Bundle the Valkey booth raffle into one self-contained HTML file.

    uv run build.py                     # asks which CSV to use -> index.html
    uv run build.py another-list.csv    # selected CSV -> index.html
    uv run build.py --template          # fake sample -> index.template.html

Reads src/raffle.html and replaces these directives:

    {{data:<path>}}   -> a base64 data URI of the file (fonts, logos)
    {{entrants}}      -> the selected CSV as a JSON string literal
    {{entrant_id}}    -> a fingerprint used to isolate saved draws by CSV

Paths are relative to this folder. Inlining everything means the page opens
from a USB stick or a laptop without a web server or an internet connection,
and Chrome's file:// restriction on web fonts does not apply to data: URIs.

Because the page inlines the entrant CSV, there are two outputs:

  index.html           the live raffle, built from the selected entrant list.
                       Both that CSV and this page hold personal data, so both
                       are git-ignored and stay local only.
  index.template.html  safe example built from valkey-raffle.sample.csv (fake data).
                       Rebuild it with --template after changing the source.

The template always uses the sample CSV; --template cannot take a real filename.

When no filename is supplied, an interactive build always asks which CSV to
use. Pass a filename for a non-interactive build. See valkey-raffle.sample.csv
for the expected format.

Inputs:
  ato-valkey.csv                                ATO entrant list; git-ignored
  valkey-raffle.sample.csv                      example with fake data
  ../valkey-brand/logo-svgs/                   Valkey lockup and icon (Brand Guidelines §1)
  ../valkey-brand/Valkey-Fonts/                Play, Open Sans, Cascadia Code (§3)
"""
from __future__ import annotations

import argparse
import base64
import csv
import hashlib
import json
import mimetypes
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "src" / "raffle.html"
OUT = HERE / "index.html"                       # live page (PII, git-ignored)
TEMPLATE_OUT = HERE / "index.template.html"     # committed, PII-safe
# Fake entrant list used for the committed template.
SAMPLE_ENTRANTS = HERE / "valkey-raffle.sample.csv"

MIME = {".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png"}
DIRECTIVE = re.compile(r"\{\{data:([^}]+)\}\}|\{\{entrants\}\}|\{\{entrant_id\}\}")
ATO_COLUMNS = {
    "timestamp", "first name", "last name", "email address",
    "github alias", "primary social media platform",
}


def resolve(rel: str) -> Path:
    path = (HERE / rel.strip()).resolve()
    if not path.is_file():
        sys.exit(f"build.py: missing asset {rel.strip()!r} (looked at {path})")
    return path


def resolve_entrants(filename: str | None) -> Path:
    """Return the requested CSV, prompting whenever no filename was supplied.

    Relative paths are resolved from this folder, even when called elsewhere.
    """
    if filename is None:
        if not sys.stdin or not sys.stdin.isatty():
            sys.exit("build.py: no terminal to ask for a CSV; pass its filename as an argument")
        available = sorted(path.name for path in HERE.glob("*.csv") if path.is_file())
        if available:
            print("Available CSV files:")
            for name in available:
                label = " (sample)" if name.endswith(".sample.csv") else ""
                print(f"  {name}{label}")

    while True:
        if filename is None:
            try:
                answer = input("Enter the entrant CSV filename (or path), or blank to cancel: ").strip()
            except EOFError:
                answer = ""
            if not answer:
                sys.exit("build.py: cancelled, no entrant CSV provided")
        else:
            answer = filename

        path = Path(answer).expanduser()
        path = (path if path.is_absolute() else HERE / path).resolve()
        if path.suffix.lower() != ".csv":
            error = f"build.py: expected a .csv file, got {path.name!r}"
        elif not path.is_file():
            error = f"build.py: entrant list not found at {path}"
        else:
            return path
        if filename is not None:
            sys.exit(error)
        print(error, file=sys.stderr)


def csv_summary(path: Path) -> str:
    try:
        with path.open(newline="", encoding="utf-8-sig") as handle:
            rows = [row for row in csv.reader(handle) if any(cell.strip() for cell in row)]
    except (UnicodeError, csv.Error) as exc:
        sys.exit(f"build.py: cannot read {path.name!r} as UTF-8 CSV: {exc}")
    if not rows:
        sys.exit(f"build.py: {path.name!r} is empty")

    headers = {cell.strip().lower() for cell in rows[0]}
    if ATO_COLUMNS <= headers:
        header_rows = 1
    elif {"name", "email"} <= headers:
        header_rows = 1
    elif len(rows) > 1 and rows[0][0].strip().lower() == "valkey raffle list" and {
        cell.strip().lower() for cell in rows[1]
    } >= {"name", "email"}:
        header_rows = 2
    else:
        sys.exit(
            f"build.py: {path.name!r} needs the ATO columns "
            "(Timestamp, First Name, Last Name, Email Address, GitHub Alias, "
            "Primary Social Media Platform) or Name,Email"
        )
    count = len(rows) - header_rows
    if not count:
        sys.exit(f"build.py: {path.name!r} has no entrants")
    return f"{count} data rows in {path.name}"


def replace(match: re.Match[str], csv_text: str) -> str:
    if match.group(0) == "{{entrants}}":
        return json.dumps(csv_text).replace("</", "<\\/")
    if match.group(0) == "{{entrant_id}}":
        return json.dumps(hashlib.sha256(csv_text.encode("utf-8")).hexdigest()[:16])
    path = resolve(match.group(1))
    mime = MIME.get(path.suffix.lower()) or mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"


def build_html(entrants: Path) -> str:
    csv_text = entrants.read_text(encoding="utf-8-sig")
    html = DIRECTIVE.sub(
        lambda match: replace(match, csv_text),
        SRC.read_text(encoding="utf-8"),
    )
    leftover = re.findall(r"\{\{[^}]*\}\}", html)
    if leftover:
        sys.exit(f"build.py: unreplaced placeholders {leftover}")
    return html


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the Valkey booth raffle page.")
    parser.add_argument(
        "csv", nargs="?", help="entrant CSV filename or path (prompted if omitted)",
    )
    parser.add_argument(
        "--template", action="store_true",
        help="build the committed, PII-safe index.template.html from the sample CSV",
    )
    args = parser.parse_args()

    if args.template:
        if args.csv:
            parser.error("--template always uses the fake sample CSV; omit the filename")
        if not SAMPLE_ENTRANTS.is_file():
            sys.exit(f"build.py: sample CSV not found at {SAMPLE_ENTRANTS}")
        entrants = SAMPLE_ENTRANTS.resolve()
        out = TEMPLATE_OUT
    else:
        entrants = resolve_entrants(args.csv)
        out = OUT

    summary = csv_summary(entrants)
    html = build_html(entrants)
    out.write_text(html, encoding="utf-8")
    print(f"wrote {out.relative_to(HERE)} ({out.stat().st_size / 1024:.0f} KB)")
    print(summary)
    if not args.template and entrants == SAMPLE_ENTRANTS.resolve():
        print("note: built the live page from the sample CSV; it contains no real entrants.")


if __name__ == "__main__":
    main()
