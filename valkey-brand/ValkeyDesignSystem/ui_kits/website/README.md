# UI kit — valkey.io website

A click-through recreation of the Valkey website, built from the templates and SASS in
<https://github.com/rlunar/valkey-io.github.io> (branch `main`), not from screenshots.

## Screens

| File | Screen | Built from |
|---|---|---|
| `screen-home.jsx` | Home: hero, What's New band, Documentation band, participants carousel | `templates/index.html`, `templates/includes/release.html`, `templates/includes/participant-carousel.html`, `content/_index.md`, `sass/_valkey.scss` |
| `screen-docs.jsx` | Documentation topic page with breadcrumbs, prose, code, sticky decorative aside | `templates/docs-page.html`, `templates/left-aside.html`, `sass/_valkey.scss` |
| `screen-commands.jsx` | Command reference with live search and grouped entries | `templates/commands.html` |
| `screen-blog.jsx` | Blog index with type badges, filter select and featured aside | `templates/blog.html`, `sass/_valkey.scss` |
| `screen-community.jsx` | Community card grid | `templates/community.html`, `content/community/_index.md` |
| `page-shell.jsx` | Shared chrome: gradient page title, two-column article layout, aside blocks | `templates/default.html`, `templates/left-aside.html` |
| `app.jsx` | Screen switching via header nav clicks; remembers the last screen in localStorage | — |

## What is interactive

- Header nav and submenus route between the five screens; the logo returns home.
- The announcement banner dismisses.
- Command search filters live and shows the real empty state (`</>` glyph, "Check your spelling or try different keywords").
- The blog type select filters the post list.
- Participant carousel dots move the track (0.5s ease-in-out, as in the source).

## Deliberate fidelity notes

- Headings here use **Play** per the 2026 brand guideline; the live site still inherits Open Sans. This is the one intentional divergence from the implementation.
- Content is representative rather than live: release numbers, blog posts, command summaries and participant offerings are stand-ins written in the project's voice. Participant logos are the real files from the repo.
- Sections with no counterpart in the source (search overlays, dark mode, login) are omitted rather than invented.
