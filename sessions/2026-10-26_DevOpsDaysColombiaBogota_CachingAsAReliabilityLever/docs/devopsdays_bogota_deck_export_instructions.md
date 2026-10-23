# Export instructions — Slidev & Marp decks

Both decks are plain markdown and render the same content in the Valkey palette. Pick whichever toolchain you prefer.

- **Slidev** (`devopsdays_bogota_caching_slidev.md`): click-driven animations (`v-click`, line-highlight, `v-mark`). Best for presenting live from a laptop.
- **Marp** (`devopsdays_bogota_caching_marp.md`): CSS-only, no click builds. Best for a portable PDF/PPTX you hand off or email.

Speaker notes live in both files (Slidev: `<!-- -->` per slide, shown in presenter mode; Marp: HTML comments, exported to PPTX notes).

> **Marp builds are now baked in.** The three key diagrams (degradation cascade, pool-math table, threshold table) are pre-expanded into incremental copy-forward slides — 6, 3, and 5 slides respectively — so the PDF/PPTX animates top-to-bottom with no extra tooling. Advance one slide per beat in presenter mode. The Marp deck is therefore longer than the Slidev one by design (same content, the builds are separate pages instead of click steps).

---

## Slidev

**One-time setup**
```
npm install -g @slidev/cli
```

**Present live** (presenter mode has the speaker notes + next-slide preview)
```
slidev devopsdays_bogota_caching_slidev.md
# opens http://localhost:3030  ·  press "p" for presenter view
```

**Export**
```
# PDF (static, animations flattened to final state of each slide)
slidev export devopsdays_bogota_caching_slidev.md --format pdf

# PDF with each click-step as its own page (keeps the builds)
slidev export devopsdays_bogota_caching_slidev.md --format pdf --with-clicks

# PPTX (one slide per click-step)
slidev export devopsdays_bogota_caching_slidev.md --format pptx --with-clicks

# PNG per slide
slidev export devopsdays_bogota_caching_slidev.md --format png
```
Export needs Playwright once: `npm i -D playwright-chromium`.

---

## Marp

**One-time setup**
```
npm install -g @marp-team/marp-cli
```

**Preview live** (re-renders on save)
```
marp -p -w devopsdays_bogota_caching_marp.md
```

**Export**
```
# PDF
marp devopsdays_bogota_caching_marp.md --pdf

# PDF with speaker notes included
marp devopsdays_bogota_caching_marp.md --pdf --pdf-notes

# PPTX (speaker notes land in the notes pane)
marp devopsdays_bogota_caching_marp.md --pptx

# Editable PPTX (renders each slide as live shapes where possible)
marp devopsdays_bogota_caching_marp.md --pptx --pptx-editable

# HTML (self-contained)
marp devopsdays_bogota_caching_marp.md --html
```

### Getting the step-by-step builds in Marp
Already done: the cascade, pool-math table, and threshold table are pre-expanded into incremental slides (the copy-forward pattern — each copy shows one more line/row), so the builds survive into PDF and PPTX. If you'd rather collapse any of them back to a single static slide, delete the intermediate copies and keep the last (fullest) one.

---

## Which to hand to the conference

Most DevOpsDays AV setups take a PDF or run your laptop. If you present from your own machine, use **Slidev live** (you get the animations and presenter notes). If you must submit a file, export **Marp to PDF** for the cleanest portable result, or Slidev `--format pdf --with-clicks` if you want the builds preserved as pages.
