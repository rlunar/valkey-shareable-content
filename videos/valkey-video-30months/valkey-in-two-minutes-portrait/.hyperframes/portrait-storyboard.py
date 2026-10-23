"""Derive the portrait STORYBOARD.md from the landscape one.

Same 14 frames, same timings, same voiceover, same assets and guardrails. Only the
geometry prose changes: every `roles:` line and the layout sentences are rewritten for
1080x1920, and a `portrait:` field is added per frame with the stacking rule the
worker must follow. Run once from the portrait project root.
"""
import re, sys

SRC = "../valkey-in-two-minutes/STORYBOARD.md"
sb = open(SRC, encoding="utf-8").read()

# ---- frontmatter
fm_end = sb.index("\n---\n", 4)
fm = sb[4:fm_end]
fm = fm.replace("format: 1920x1080", "format: 1080x1920")
fm = fm.replace('caption_keepout: "nothing below y 896"', 'caption_keepout: "nothing below y 1594"')
fm = re.sub(r'brand_slot: ".*"', 'brand_slot: "ONE persistent colour horizontal lockup on the MASTER timeline, bottom-right (x 840–1020, y 1760–1820). Frames NEVER draw a lockup. In Frames 2 and 13 the master timeline flies this same element into the hero position the frame leaves empty, and back."', fm)
fm = re.sub(r'style: "(.*)"', lambda m: 'style: "' + m.group(1) + '; PORTRAIT: stack what landscape placed side by side — rows become columns, 3×2 grids become 2×3, diagrams run top-to-bottom; key content inside the title-safe box x 108–972, y 192–1728"', fm)
fm += '\nvariant: "portrait 9:16 derived 2026-10-03 from the landscape storyboard; same frames, timings, voice, assets, and guardrails"'

body = sb[fm_end + 5:]

# ---- per-frame geometry rewrites (roles lines + a portrait: field)
PORTRAIT = {
 1: ("title top-left (y≈200); processor node card centred at y≈520; two VERTICAL paths run downward from it to two endpoints side by side at y≈1150 — RAM at x≈330, Disk at x≈750 — each a 120px glyph above a two-line 36px label; the RAM path lights periwinkle; the dashed persistence arrow runs from the RAM outline across to the disk endpoint; caption 'Conceptual comparison, not a benchmark' at y≈1500",
     "Paths are vertical then fan out: processor (540,520) → RAM (330,1150) and → Disk (750,1150). Same beats and cues as landscape."),
 2: ("hero-lockup zone EMPTY — reserved x 240–840, y 420–560 (the master timeline flies the lockup here); phrase captions centred at y≈760 in 48px/600, soft-wrapped to two lines inside x 108–972; LF mark 480px wide centred at y≈1000; closing statement 72px/800 periwinkle centred at y≈760 wrapped to two lines (OPEN SOURCE / FOREVER); attribution at y≈920",
     "Phrases wrap to at most two lines; nothing below y 1594."),
 3: ("title top-left; macOS terminal window 936×560 centred (x 72–1008, y 560–1120): 56px title bar 'valkey-cli' with traffic lights, body in 48px Cascadia Code, five transcript lines at 60px line-height; caret as in landscape",
     "Window narrower and taller; transcript lines unchanged (they fit at 48px)."),
 4: ("title top-left; three node_cards stacked vertically down the centre-left: APPLICATION (x≈120–420, y≈420) · VALKEY (x≈620–920, y≈700, icon mark top-right) · DATABASE (x≈120–420, y≈1000, durability glyph beside the eyebrow); flows are vertical/diagonal beziers between them with pills; step_bar at y≈1380 (full width x 72–1008, two lines allowed); footnote at y≈1500",
     "Triangle rotated: app top-left, Valkey right-middle, database bottom-left; the maroon read flow runs app→database down the left edge; same beats and cues."),
 5: ("title top-left; 9.1.2 card 600×240 centred at y≈520 (number 60px periwinkle); the two prior-line cards 440×180 side by side at y≈840 (x≈100 and x≈540); dashed PREVIEW region 600×180 centred at y≈1140; date stamp at y≈1500",
     "Stable cards stacked above the preview region; preview still visually separate."),
 6: ("title top-left; VALKEY hub card 300×140 centred at y≈900; four module cards 400×140 at the four corners of a 2×2 arrangement — top-left (x≈90,y≈560), top-right (x≈590,y≈560), bottom-left (x≈90,y≈1240), bottom-right (x≈590,y≈1240) — with connectors to the hub",
     "Same dock order and cues; cards slide in from their edges."),
 7: ("title top-left; three app cards in a row at y≈460 (x≈90/390/690, 300×130); the client band 820×360 centred at y≈840 (GLIDE 36px on top, three integrations beneath); VALKEY card 300×140 centred at y≈1300; connectors run downward",
     "Flow runs top (apps) → middle (band) → bottom (Valkey)."),
 8: ("title top-left; 2×3 grid of panel_cells (cells 440×360; columns at x≈310/770; rows at y≈520/920/1320): performance→Cache, data-hash→Sessions, data-list→Counters, security→Rate limiter, vertical-scaling→Global IDs; sixth cell = marker 'Application patterns'",
     "Grid is 2 columns × 3 rows; same waterfall arrival by 0.3s and same cue tints."),
 9: ("title top-left; same 2×3 grid geometry as Frame 8: hardening→Distributed locks, horizontal-scaling→Message queue, replication→Chats / Pub/Sub, reliability→Idempotency, community→Microservices; marker 'Application patterns'",
     "Identical cell positions to Frame 8."),
 10: ("title top-left; same 2×3 grid geometry: vertical-scaling→Rank / leaderboard, observability→Time-series, data-list→Append-only log · Streams, durability→Probabilistic membership (+ 24px second line 'Fraud prechecks · Bloom module'); fifth cell empty; sixth = marker 'Core + Bloom module'",
      "Identical cell positions to Frame 8."),
 11: ("title top-left; same 2×3 grid geometry: data-hash→Document database / JSON, hardening→Full-text search engine, general-scaling→Vector database, memory-efficiency→LLM KV cache offload, performance→Semantic cache; marker 'Modules + integrations'",
      "Identical cell positions to Frame 8."),
 12: ("title top-left; the five node_cards run TOP-TO-BOTTOM down the centre (300×130 each; centres y≈400/620/840/1060/1280; x centre 540, with EMBEDDING and MODEL offset right to x≈700 inside a dashed 'outside Valkey' boundary on the right half); the point cloud sits inside the VALKEY SEARCH card; flows are vertical beziers with pills alongside; HIT return flow runs up the left edge back to PROMPT; step_bar at y≈1420 (two lines allowed); footnote at y≈1520",
      "Pipeline vertical; the 'outside Valkey' boundary is one dashed region on the right containing EMBEDDING and MODEL; same beats and cues."),
 13: ("hero-lockup zone EMPTY — reserved x 300–780, y 260–360 (the master timeline flies the lockup here); eyebrow 'VALKEY PROJECT PARTICIPANTS' centred at y≈420; URLs at y≈470; the wall: 3 columns × 7 rows of marks in file order (01→21), each fitted inside a 260×80 box with object-fit contain, grid spanning x 120–960 and y 560–1540",
      "Wall is 3×7 instead of 7×3; same alphabetical order, same arrival by 0.3s."),
 14: ("title top-left; macOS terminal window 936×420 centred (x 72–1008, y 620–1040): title bar 'Terminal — zsh'; the command in 52px Cascadia Code soft-wrapped onto two lines ('docker run --rm' / 'valkey/valkey:alpine' in periwinkle) — the text is still one command, never altered; caption 'Core server · Docker required' at y≈1100; links 'valkey.io · github.com/valkey-io' bottom-LEFT at x≈72, y≈1500",
      "Command wraps visually at the space before 'valkey/valkey:alpine'; nothing bottom-right."),
}

def rewrite_frame(n, block):
    roles, note = PORTRAIT[n]
    block = re.sub(r"^- roles: .+$", f"- roles: {roles}", block, flags=re.M)
    block = re.sub(r"^(- focal: .+)$", r"\1\n- portrait: " + note.replace("\\", "\\\\"), block, flags=re.M, count=1)
    # landscape-specific coordinates in shot sequences are superseded by roles/portrait; flag them
    block = block.replace("**Shot sequence", "**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement)")
    return block

parts = re.split(r"^(## Frame (\d+) — .+)$", body, flags=re.M)
out = [parts[0]]
i = 1
while i < len(parts):
    heading, num, blk = parts[i], int(parts[i + 1]), parts[i + 2]
    out.append(heading + rewrite_frame(num, blk))
    i += 3
new = "---\n" + fm + "\n---\n" + "".join(out)
new = new.replace("- status: animated", "- status: outline")
open("STORYBOARD.md", "w", encoding="utf-8").write(new)
print("portrait STORYBOARD.md written:", new.count("## Frame"), "frames")
