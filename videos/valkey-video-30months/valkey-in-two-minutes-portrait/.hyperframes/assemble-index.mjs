// Assemble index.html from STORYBOARD.md (frame slots) + audio_meta.json (voice + captions).
// Re-runnable: regenerates the whole file. Run from the project root: node .hyperframes/assemble-index.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const sb = readFileSync("STORYBOARD.md", "utf8");
const meta = JSON.parse(readFileSync("audio_meta.json", "utf8"));

// ---- frames from the storyboard
const blocks = sb.split(/^## Frame (\d+) — .+$/m).slice(1);
const frames = [];
for (let i = 0; i < blocks.length; i += 2) {
  const n = Number(blocks[i]);
  const body = blocks[i + 1];
  const field = (k) => (body.match(new RegExp(`^- ${k}: (.+)$`, "m")) || [])[1]?.trim();
  const tc = field("timecode"); // 00:00.0–00:08.0
  const [mm, ss] = tc.split("–")[0].split(":");
  const start = Number(mm) * 60 + Number(ss);
  const duration = Number(field("duration"));
  const src = field("src");
  frames.push({ n, id: basename(src).replace(/\.html$/, ""), src, start, duration, voice: `f${String(n).padStart(2, "0")}` });
}
const total = frames.at(-1).start + frames.at(-1).duration;
const r2 = (x) => Math.round(x * 100) / 100;

// ---- captions: chunk words per frame (≤ 5 words / ≤ 40 chars, break at punctuation), absolute times
const voices = Object.fromEntries(meta.voices.map((v) => [v.id, v]));
const caps = [];
for (const f of frames) {
  const v = voices[f.voice];
  if (!v) continue;
  const words = mergeSpoken(v.words);
  const chunks = [];
  let cur = [];
  const flush = () => { if (cur.length) { chunks.push(cur); cur = []; } };
  for (const w of words) {
    cur.push(w);
    const text = cur.map((x) => x.text).join(" ");
    const endsClause = /[.,;:!?]$/.test(w.text);
    if (cur.length >= 6 || text.length >= 46 || endsClause) flush();
  }
  flush();
  // merge any one-word chunk into its predecessor (or successor when it is first) so no pill carries a lone word
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].length > 1) continue;
    if (i > 0) { chunks[i - 1].push(...chunks[i]); chunks.splice(i, 1); i--; }
    else if (i + 1 < chunks.length) { chunks[i + 1].unshift(...chunks[i]); chunks.splice(i, 1); i--; }
  }
  const tidy = (t) => t.replace(/key-value/g, "key/value");
  chunks.forEach((c, i) => {
    const s = f.start + c[0].start;
    let e = f.start + c.at(-1).end + 0.35;
    const next = chunks[i + 1];
    if (next) e = Math.min(e, f.start + next[0].start - 0.02);
    e = Math.min(e, f.start + f.duration - 0.05);
    if (e - s < 0.5) e = Math.min(s + 0.5, f.start + f.duration - 0.05);
    caps.push({ s: r2(s), d: r2(e - s), text: tidy(c.map((x) => x.text).join(" ")) });
  });
}

const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The narration spells the URL ("valkey dot I O") so the voice says it right; the caption shows what you type.
function mergeSpoken(words) {
  const out = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const nxt = words.slice(i, i + 4).map((x) => x.text.replace(/[.,]$/, "").toLowerCase()).join(" ");
    if (/^valkey dot i o$/.test(nxt)) {
      const last = words[i + 3];
      out.push({ ...w, text: "valkey.io" + (/[.]$/.test(last.text) ? "." : ""), end: last.end });
      i += 3;
    } else out.push(w);
  }
  return out;
}

// ---- brand slot flights: slot at left 1660 / top 940 / width 200; hero zones from the storyboard
// f02 hero: 600px wide centred (left 660, top 262) → scale 3 ; f13 hero: 320px wide (left 800, top 150) → scale 1.6
const f02 = frames.find((f) => f.n === 2), f13 = frames.find((f) => f.n === 13);
const flights = [
  { at: f02.start, x: 240 - 840, y: 420 - 1760, scale: 600 / 180, back: f02.start + f02.duration - 0.6 },
  { at: f13.start, x: 300 - 840, y: 260 - 1760, scale: 480 / 180, back: f13.start + f13.duration - 0.6 },
];

const slotHtml = frames.map((f) => `      <div id="el-${f.id}" data-composition-id="${f.id}" data-composition-src="${f.src}" data-start="${f.start}" data-duration="${f.duration}" data-track-index="1" data-width="1080" data-height="1920"></div>`).join("\n");
const audioHtml = frames.filter((f) => voices[f.voice]).map((f) => `      <audio id="vo-${f.voice}" src="${voices[f.voice].path}" data-audio-group="voiceover" data-start="${f.start}" data-duration="${r2(voices[f.voice].duration_s)}" data-track-index="10" data-volume="1"></audio>`).join("\n");
// music bed: the looped, faded full-length bed built from the resolved catalog track; carved against the voiceover group by carve.mjs
const BED_VOLUME = 0.18; // same bed, same carve as landscape
const bedHtml = `      <audio id="music-bed" src="assets/bgm/bed.wav" data-audio-group="music" data-start="0" data-duration="${total}" data-track-index="11" data-volume="${BED_VOLUME}"${existingCarve()}></audio>`;
function existingCarve() {
  // preserve carve attributes written by carve.mjs across re-assembly
  try {
    const prev = readFileSync("index.html", "utf8");
    const m = prev.match(/<audio id="music-bed"[^>]*>/);
    if (!m) return "";
    const attrs = [];
    for (const key of ["data-fx-carve", "data-fx-chain", "data-automation"]) {
      const a = m[0].match(new RegExp(`\\s${key}='[^']*'|\\s${key}="[^"]*"`));
      if (a) attrs.push(a[0]);
    }
    return attrs.join("");
  } catch { return ""; }
}
const capHtml = caps.map((c, i) => `      <div id="cap-${String(i + 1).padStart(3, "0")}" class="clip hf-cap" data-start="${c.s}" data-duration="${c.d}" data-track-index="3"><span class="hf-cap-pill">${esc(c.text)}</span></div>`).join("\n");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Valkey in two minutes</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      @font-face { font-family: "Open Sans"; src: url("assets/fonts/OpenSans-Variable.woff2") format("woff2"); font-weight: 300 800; font-style: normal; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: #FFFFFF; }
      /* the film's base ground: frame.md canvas */
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #FFFFFF; font-family: "Open Sans", sans-serif; }
      /* frame slots fill the root */
      #root > div[data-composition-src] { position: absolute; inset: 0; }
      /* persistent brand slot — one element for the whole film; the master timeline flies it */
      #el-brand { position: absolute; inset: 0; pointer-events: none; }
      #brand-wrap { position: absolute; left: 840px; top: 1760px; width: 180px; height: 61px; transform-origin: 0 0; }
      #brand-wrap img { display: block; width: 180px; height: 61px; object-fit: contain; }
      /* captions — reserved lower band, clear of the brand slot on the right */
      .hf-cap { position: absolute; left: 108px; top: 1620px; width: 864px; height: 110px; display: flex; align-items: center; justify-content: center; }
      .hf-cap-pill { display: inline-block; max-width: 1200px; padding: 10px 26px; border: 2px solid #D3DDE7; border-radius: 999px; background: rgba(255, 255, 255, 0.96); color: #30176E; font-family: "Open Sans", sans-serif; font-size: 30px; font-weight: 600; line-height: 40px; white-space: normal; text-align: center; max-width: 820px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1080" data-height="1920">
      <!-- track 1: the fourteen frames, sequential -->
${slotHtml}

      <!-- track 2: the persistent brand lockup -->
      <div id="el-brand" class="clip" data-start="0" data-duration="${total}" data-track-index="2">
        <div id="brand-wrap"><img src="assets/brand/valkey-horizontal-color.svg" alt="" /></div>
      </div>

      <!-- track 3: captions from the voice word timings -->
${capHtml}

      <!-- track 10: voiceover, one clip per frame (group: voiceover) -->
${audioHtml}

      <!-- track 11: music bed, carved against the voiceover group -->
${bedHtml}
    </div>

    <script>
      (() => {
        const tl = gsap.timeline({ paused: true });
        // The brand slot is born at the end of Frame 1 (storyboard: fades in at 6s) and never leaves.
        tl.fromTo("#brand-wrap", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, 6.0);
        // Hero flights: the same element travels from the corner into the frame's empty hero zone and back.
${flights.map((fl) => `        tl.to("#brand-wrap", { x: ${fl.x}, y: ${fl.y}, scale: ${fl.scale}, duration: 0.7, ease: "power3.inOut" }, ${fl.at});
        tl.to("#brand-wrap", { x: 0, y: 0, scale: 1, duration: 0.6, ease: "power3.inOut" }, ${r2(fl.back)});`).join("\n")}
        window.__timelines["main"] = tl;
      })();
    </script>
  </body>
</html>
`;
writeFileSync("index.html", html);
console.log(`index.html: ${frames.length} frames, total ${total}s, ${caps.length} captions, ${frames.length} voice clips`);
