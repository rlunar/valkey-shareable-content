"""Load and validate slidecks.yaml, the list of Slidev decks to publish."""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

import yaml

# A deck name doubles as the repository subfolder and the S3 key prefix, so it
# must be safe in URLs and object keys.
DECK_NAME_PATTERN = re.compile(r"^[a-z0-9][a-z0-9-]*$")


class ConfigError(ValueError):
    """Raised when slidecks.yaml is missing, malformed, or inconsistent."""


@dataclass(frozen=True)
class SiteConfig:
    title: str
    description: str = ""


@dataclass(frozen=True)
class Deck:
    name: str
    title: str
    description: str = ""
    event: str = ""
    source_dir: Path = field(compare=False, default=Path())

    @property
    def dist_dir(self) -> Path:
        """Slidev build output, expected to be built with --base /<name>/."""
        return self.source_dir / "dist"

    @property
    def base_path(self) -> str:
        """URL path the deck is served from (also the Slidev --base value)."""
        return f"/{self.name}/"


@dataclass(frozen=True)
class SlideDecksConfig:
    site: SiteConfig
    decks: tuple[Deck, ...]
    path: Path


def load_config(config_path: Path, decks_root: Path) -> SlideDecksConfig:
    """Parse slidecks.yaml and resolve each deck under ``decks_root``.

    ``decks_root`` is the directory the deck subfolders live in (the
    repository's ``sessions/`` directory), which is also where
    ``slidecks.yaml`` itself lives.
    """
    if not config_path.is_file():
        raise ConfigError(f"slidecks file not found: {config_path}")

    with config_path.open(encoding="utf-8") as handle:
        raw = yaml.safe_load(handle) or {}

    if not isinstance(raw, dict):
        raise ConfigError(f"{config_path}: top level must be a mapping")

    site = _parse_site(raw.get("site"), config_path)
    decks = _parse_decks(raw.get("decks"), config_path, decks_root)
    return SlideDecksConfig(site=site, decks=decks, path=config_path)


def _parse_site(raw: object, config_path: Path) -> SiteConfig:
    if raw is None:
        return SiteConfig(title="Slide Decks")
    if not isinstance(raw, dict):
        raise ConfigError(f"{config_path}: 'site' must be a mapping")
    return SiteConfig(
        title=_required_str(raw, "title", f"{config_path}: site"),
        description=_optional_str(raw, "description", f"{config_path}: site"),
    )


def _parse_decks(raw: object, config_path: Path, decks_root: Path) -> tuple[Deck, ...]:
    if not isinstance(raw, list) or not raw:
        raise ConfigError(f"{config_path}: 'decks' must be a non-empty list")

    decks: list[Deck] = []
    seen: set[str] = set()
    for index, entry in enumerate(raw):
        where = f"{config_path}: decks[{index}]"
        if not isinstance(entry, dict):
            raise ConfigError(f"{where} must be a mapping")

        name = _required_str(entry, "name", where)
        if not DECK_NAME_PATTERN.match(name):
            raise ConfigError(
                f"{where}: name {name!r} must be lowercase letters, digits, and hyphens"
            )
        if name in seen:
            raise ConfigError(f"{where}: duplicate deck name {name!r}")
        seen.add(name)

        source_dir = decks_root / name
        if not (source_dir / "slides.md").is_file():
            raise ConfigError(
                f"{where}: {source_dir} is not a Slidev project (no slides.md found)"
            )

        decks.append(
            Deck(
                name=name,
                title=_required_str(entry, "title", where),
                description=_optional_str(entry, "description", where),
                event=_optional_str(entry, "event", where),
                source_dir=source_dir,
            )
        )
    return tuple(decks)


def _required_str(mapping: dict, key: str, where: str) -> str:
    value = mapping.get(key)
    if not isinstance(value, str) or not value.strip():
        raise ConfigError(f"{where}: '{key}' is required and must be a non-empty string")
    return value.strip()


def _optional_str(mapping: dict, key: str, where: str) -> str:
    value = mapping.get(key)
    if value is None:
        return ""
    if not isinstance(value, str):
        raise ConfigError(f"{where}: '{key}' must be a string")
    return value.strip()
