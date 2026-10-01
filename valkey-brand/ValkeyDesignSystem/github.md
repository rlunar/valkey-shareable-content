# Source repository

repo: rlunar/valkey-io.github.io
branch: main
path: (whole repo; read sass/, templates/, content/, static/img/)

Upstream project: https://github.com/valkey-io/valkey-io.github.io
Brand assets came from a separately attached local folder (`valkey-brand-assets/`), not from this repo.

## Last sync

date: 2026-09-07T22:55:20Z

### Updated in this project

- Imported the site's 14 SVG icons, hero and aside imagery, and 12 participant logos into `assets/`.
- Derived implementation color, gradient, spacing and shape tokens from `sass/_valkey.scss` and `sass/_colors.scss`.
- Recreated five website screens in `ui_kits/website/` from the Zola templates.
- Recorded guideline-vs-implementation divergences (Play vs Open Sans headings, Cascadia Code vs Fira Mono) in `readme.md`.

## Screen map

| Project screen | Repo files |
|---|---|
| `ui_kits/website/screen-home.jsx` | `templates/index.html`, `templates/includes/release.html`, `templates/includes/participant-carousel.html`, `content/_index.md`, `sass/_valkey.scss` |
| `ui_kits/website/screen-docs.jsx` | `templates/docs-page.html`, `templates/left-aside.html`, `sass/_valkey.scss` |
| `ui_kits/website/screen-commands.jsx` | `templates/commands.html` |
| `ui_kits/website/screen-blog.jsx` | `templates/blog.html`, `sass/_valkey.scss` |
| `ui_kits/website/screen-community.jsx` | `templates/community.html`, `content/community/_index.md` |
| `ui_kits/website/page-shell.jsx` | `templates/default.html`, `templates/left-aside.html` |
| `components/navigation/SiteHeader.jsx`, `SiteFooter.jsx`, `Banner.jsx` | `templates/default.html`, `sass/_valkey.scss` |
| `tokens/*.css` | `sass/_valkey.scss`, `sass/_colors.scss`, `sass/_typography.scss`, `config.toml` |
