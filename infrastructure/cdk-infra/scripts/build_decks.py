#!/usr/bin/env python3
"""Build every Slidev deck listed in slidecks.yaml for the slide decks site.

Each deck is served from https://<site>/<name>/, so `slidev build` must run
with `--base /<name>/`; a plain `pnpm run build` produces a deck that only
works at the domain root. Run this before `cdk synth` or `cdk deploy`.

Usage (from cdk-infra, with the virtualenv active):

    python scripts/build_decks.py                # install deps and build all decks
    python scripts/build_decks.py --skip-install # reuse existing node_modules
    python scripts/build_decks.py valkey-slidev  # build only the named deck(s)
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

CDK_INFRA = Path(__file__).resolve().parent.parent
# CDK_INFRA is <repo_root>/infrastructure/cdk-infra; climb two more for the root.
REPO_ROOT = CDK_INFRA.parent.parent
SESSIONS_DIR = REPO_ROOT / "sessions"
sys.path.insert(0, str(CDK_INFRA))

from slide_decks.config import ConfigError, Deck, load_config  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("decks", nargs="*", help="deck names to build (default: all decks in slidecks.yaml)")
    parser.add_argument("--skip-install", action="store_true", help="do not run `pnpm install` first")
    parser.add_argument(
        "--config",
        type=Path,
        default=SESSIONS_DIR / "slidecks.yaml",
        help="path to slidecks.yaml (default: sessions/slidecks.yaml)",
    )
    args = parser.parse_args()

    if shutil.which("pnpm") is None:
        print("error: pnpm is required to build the decks (https://pnpm.io/installation)", file=sys.stderr)
        return 1

    try:
        config = load_config(args.config, decks_root=SESSIONS_DIR)
    except ConfigError as error:
        print(f"error: {error}", file=sys.stderr)
        return 1

    selected = _select_decks(config.decks, args.decks)
    if selected is None:
        return 1

    for deck in selected:
        print(f"\n==> {deck.name} (base {deck.base_path})", flush=True)
        if not args.skip_install:
            _run(["pnpm", "install", "--frozen-lockfile"], cwd=deck.source_dir)
        _run(
            ["pnpm", "exec", "slidev", "build", "slides.md", "--base", deck.base_path, "--out", "dist"],
            cwd=deck.source_dir,
        )
        if not (deck.dist_dir / "index.html").is_file():
            print(f"error: {deck.name}: build finished but {deck.dist_dir / 'index.html'} is missing", file=sys.stderr)
            return 1

    print(f"\nBuilt {len(selected)} deck(s). Next: cdk synth / cdk deploy from {CDK_INFRA}")
    return 0


def _select_decks(decks: tuple[Deck, ...], requested: list[str]) -> list[Deck] | None:
    if not requested:
        return list(decks)
    by_name = {deck.name: deck for deck in decks}
    unknown = [name for name in requested if name not in by_name]
    if unknown:
        print(f"error: not in slidecks.yaml: {', '.join(unknown)}", file=sys.stderr)
        print(f"known decks: {', '.join(by_name)}", file=sys.stderr)
        return None
    return [by_name[name] for name in requested]


def _run(command: list[str], cwd: Path) -> None:
    print("$", " ".join(command), flush=True)
    subprocess.run(command, cwd=cwd, check=True)


if __name__ == "__main__":
    try:
        sys.exit(main())
    except subprocess.CalledProcessError as error:
        print(f"error: command failed with exit code {error.returncode}: {' '.join(error.cmd)}", file=sys.stderr)
        sys.exit(error.returncode)
