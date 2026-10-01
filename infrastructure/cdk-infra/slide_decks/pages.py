"""Render the static pages uploaded to the bucket root (index.html, 404.html)."""

from __future__ import annotations

from html import escape

from .config import SlideDecksConfig

# Valkey brand tokens (see slides-skill.md at the repository root).
_VALKEY_BLUE = "#6983FF"
_DARK = "#232F3E"
_DARKER = "#1A2026"
_LIGHT = "#F1F3F3"

_STYLE = f"""
    :root {{
      color-scheme: light;
      --accent: {_VALKEY_BLUE};
      --text: {_DARK};
      --text-strong: {_DARKER};
      --surface: {_LIGHT};
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      line-height: 1.5;
      color: var(--text);
      background: #ffffff;
    }}
    header, main, footer {{
      width: min(64rem, 100% - 3rem);
      margin: 0 auto;
    }}
    header {{ padding: 3rem 0 1.5rem; border-bottom: 4px solid var(--accent); }}
    h1 {{ margin: 0 0 0.5rem; font-size: 2.25rem; color: var(--text-strong); }}
    header p {{ margin: 0; font-size: 1.125rem; }}
    main {{ padding: 2rem 0 3rem; }}
    ul.decks {{ list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; }}
    ul.decks a {{
      display: block;
      padding: 1.25rem 1.5rem;
      border-radius: 0.75rem;
      background: var(--surface);
      border-left: 6px solid var(--accent);
      color: inherit;
      text-decoration: none;
    }}
    ul.decks a:hover, ul.decks a:focus-visible {{
      outline: 3px solid var(--accent);
      outline-offset: 2px;
    }}
    ul.decks h2 {{ margin: 0 0 0.35rem; font-size: 1.25rem; color: var(--text-strong); }}
    ul.decks p {{ margin: 0; }}
    ul.decks .event {{ margin-top: 0.5rem; font-size: 0.9rem; color: var(--accent); font-weight: 600; }}
    footer {{ padding: 0 0 3rem; font-size: 0.9rem; }}
    footer a {{ color: var(--accent); }}
"""


def render_index_html(config: SlideDecksConfig) -> str:
    """The landing page that links to every deck listed in slidecks.yaml."""
    title = escape(config.site.title)
    description = escape(config.site.description)

    items = []
    for deck in config.decks:
        parts = [f"<h2>{escape(deck.title)}</h2>"]
        if deck.description:
            parts.append(f"<p>{escape(deck.description)}</p>")
        if deck.event:
            parts.append(f'<p class="event">{escape(deck.event)}</p>')
        body = "\n          ".join(parts)
        items.append(
            f'      <li>\n        <a href="{escape(deck.base_path, quote=True)}">\n'
            f"          {body}\n        </a>\n      </li>"
        )
    deck_list = "\n".join(items)

    description_meta = f'\n  <meta name="description" content="{description}">' if description else ""
    description_html = f"\n    <p>{description}</p>" if description else ""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>{description_meta}
  <style>{_STYLE}  </style>
</head>
<body>
  <header>
    <h1>{title}</h1>{description_html}
  </header>
  <main>
    <ul class="decks" aria-label="Presentations">
{deck_list}
    </ul>
  </main>
  <footer>
    <p>Presentations built with <a href="https://sli.dev/">Slidev</a>. Use the arrow keys inside a deck to navigate slides.</p>
  </footer>
</body>
</html>
"""


def render_not_found_html(config: SlideDecksConfig) -> str:
    """Served by CloudFront for objects that do not exist in the bucket."""
    title = escape(config.site.title)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Not found | {title}</title>
  <style>{_STYLE}  </style>
</head>
<body>
  <header>
    <h1>Page not found</h1>
    <p>There is no slide deck or file at this address.</p>
  </header>
  <main>
    <p><a href="/" style="color: var(--accent);">Back to {title}</a></p>
  </main>
</body>
</html>
"""
