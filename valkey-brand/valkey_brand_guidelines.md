# Valkey Brand Guidelines

**Version 2.0 — September 2026**

These guidelines define the visual and editorial system for Valkey brand
materials, websites, documentation, presentations, social media, events, and
code samples.

The official logo artwork and fonts referenced below are distributed alongside
this document. For digital work, use the supplied SVG and WOFF2 files whenever
possible.

## Brand System at a Glance

| Element | Standard |
|---|---|
| Primary logo | Full-color horizontal Valkey logo |
| Compact logo | Full-color stacked Valkey logo |
| Symbol | Valkey keyhole icon |
| Logo typeface | Inter; use the supplied logo artwork rather than retyping the wordmark |
| Titles and display text | Play |
| Body text and interface copy | Open Sans |
| Code and terminal text | Cascadia Code |
| Primary colors | ValkeyBlueAura `#6983FF`, ValkeyBlackDenim `#1A2026` |
| Supporting colors | ValkeyPurpleIndigo `#30176E`, ValkeyPalaceBurgundy `#642637`, ValkeyCandy `#E0A2AF`, ValkeySummerLavender `#BCB5E7` |
| Gradient library | Five light and five dark gradients in [`valkey-gradients.css`](./valkey-gradients.css) |
| Core visual language | Clear technical layouts, generous spacing, rounded cards, and ValkeyPurpleIndigo-to-ValkeyBlueAura depth |

## 1. Logo

### 1.1 Primary Logo

Use the full-color horizontal logo wherever space permits. It is the default
choice for website headers, documentation, event materials, presentations, and
co-branded layouts.

<img src="./logo-svgs/valkey-horizontal-color.svg" alt="Valkey horizontal logo" width="376">

Preferred asset:
[valkey-horizontal-color.svg](./logo-svgs/valkey-horizontal-color.svg)

### 1.2 Stacked Logo

Use the stacked logo when a horizontal mark would be too small or when the
available area is close to square, such as a booth panel, social card, sticker,
or centered title page.

<img src="./logo-svgs/valkey-stacked-color.svg" alt="Valkey stacked logo" width="280">

Preferred asset:
[valkey-stacked-color.svg](./logo-svgs/valkey-stacked-color.svg)

### 1.3 Icon

The Valkey icon is the symbol portion of the logo. Use it for favicons, app
icons, avatars, small badges, and places where the full wordmark has already
been established nearby.

<img src="./logo-svgs/valkey-icon-periwinkle.svg" alt="Valkey icon" width="120">

Do not use the icon as a replacement for the full logo on a viewer's first
encounter with Valkey.

### 1.4 Approved Logo Variants

Use the variant designed for the background. Do not recolor an SVG or apply a
CSS filter when an approved asset is available.

| Background or production need | Horizontal | Stacked | Icon |
|---|---|---|---|
| Light or ValkeyBestWhite background | [Full color](./logo-svgs/valkey-horizontal-color.svg) | [Full color](./logo-svgs/valkey-stacked-color.svg) | [ValkeyBlueAura](./logo-svgs/valkey-icon-periwinkle.svg) |
| Dark, purple, or dark photographic background | [Full color with light wordmark](./logo-svgs/valkey-horizontal-color-light.svg) | [Full color with light wordmark](./logo-svgs/valkey-stacked-color-light.svg) | [White](./logo-svgs/valkey-icon-white.svg) |
| One-color dark artwork on a light background | [Black](./logo-svgs/valkey-horizontal-black.svg) | [Black](./logo-svgs/valkey-stacked-black.svg) | [Black](./logo-svgs/valkey-icon-black.svg) |
| One-color light artwork on a dark background | [White](./logo-svgs/valkey-horizontal-white.svg) | [White](./logo-svgs/valkey-stacked-white.svg) | [White](./logo-svgs/valkey-icon-white.svg) |

SVG is preferred for web, print, signage, and presentations. Use the supplied
[PNG files](./logo-pngs/) only when the destination does not support SVG.

### 1.5 Clear Space

Always preserve clear space around the logo.

Define **X** as the diameter of the circular opening at the head of the keyhole
inside the Valkey symbol. Keep at least **1X** of clear space on every side of
the horizontal, stacked, or icon-only logo.

No text, partner mark, border, illustration, or edge of a composition may enter
this area. More space is encouraged in editorial and presentation layouts.

### 1.6 Minimum Size

These minimums preserve the keyhole detail and wordmark:

| Logo | Digital minimum | Print minimum |
|---|---:|---:|
| Horizontal | 120 px wide | 32 mm wide |
| Stacked | 96 px wide | 25 mm wide |
| Icon only | 16 px square | 6 mm square |

At very small sizes, use the icon rather than shrinking the wordmark below its
minimum.

### 1.7 Background Control

- Prefer a solid ValkeyBestWhite, ValkeyColdCream3, ValkeyBlackDenim, or
  ValkeyPurpleIndigo field behind the logo.
- On photographs, place the logo over a visually quiet area with strong
  contrast.
- If a photograph is busy, add a solid or sufficiently opaque brand-color
  field rather than adding an outline or drop shadow to the logo.
- The light color logo uses the exact light wordmark color embedded in the
  official artwork. Do not substitute another tint.

### 1.8 Co-branding

- Keep Valkey and partner logos optically balanced, not necessarily
  mathematically equal in width.
- Separate marks by at least the Valkey logo's **1X** clear-space unit.
- Use a thin neutral divider only when needed to clarify ownership.
- Do not combine the Valkey logo with another mark to create a new logo without
  project approval.

### 1.9 Logo Use Not Permitted

Do not:

- change any logo color;
- rebuild or retype the wordmark;
- alter, remove, or rearrange logo elements;
- stretch, compress, skew, rotate, or crop the logo;
- add an outline, glow, bevel, texture, or drop shadow;
- place the logo in a container that touches its clear space;
- use a low-contrast logo variant;
- place text or imagery inside the symbol;
- animate individual logo parts in a way that changes the mark;
- use the Valkey symbol as a decorative bullet or repeated background pattern.

## 2. Color

### 2.1 Core Palette

Hex values are authoritative for screen use. RGB values below are calculated
from those exact hex values.

Canonical color names are written without spaces. Preserve their capitalization
when naming design tokens, styles, swatches, or exported assets.

| Color | HEX | RGB | Primary use |
|---|---|---|---|
| ValkeyBlueAura | `#6983FF` | 105, 131, 255 | Brand accent, icon, focus, large fields, gradients |
| ValkeyBlackDenim | `#1A2026` | 26, 32, 38 | Primary text, dark backgrounds, footer, code surfaces |
| ValkeyBestWhite | `#FFFDFA` | 255, 253, 250 | Preferred light brand background |

### 2.2 Supporting Palette

| Color | HEX | RGB | Primary use |
|---|---|---|---|
| ValkeyPurpleIndigo | `#30176E` | 48, 23, 110 | Dark brand fields, headings, gradients |
| ValkeyPalaceBurgundy | `#642637` | 100, 38, 55 | Editorial accent, notices, dark text accent |
| ValkeyCandy | `#E0A2AF` | 224, 162, 175 | Highlight on dark fields, illustration |
| ValkeySummerLavender | `#BCB5E7` | 188, 181, 231 | Highlight on dark fields, illustration, secondary surfaces |

### 2.3 Neutral and Logo Tints

| Color | HEX | RGB | Primary use |
|---|---|---|---|
| ValkeyColdCream3 | `#F7FBFE` | 247, 251, 254 | Cool light surface and code text |
| ValkeyMistyIce | `#D3DDE7` | 211, 221, 231 | Borders and separators on light surfaces |
| Logo Light | `#E7E4F4` | 231, 228, 244 | Embedded light wordmark color; logo use only |
| Pure White | `#FFFFFF` | 255, 255, 255 | White logo artwork and high-contrast UI surfaces |

Do not replace Logo Light with ValkeyBestWhite inside a logo file. The logo
artwork contains the approved color.

### 2.4 Print References

The following CMYK and Pantone values are retained from the original 2024
guideline as production references. Always request a physical proof because
paper, coating, printer profiles, and spot-color libraries can change the
result.

| Color | CMYK | Pantone reference |
|---|---|---|
| ValkeyBlueAura | 63, 51, 0, 0 | 2718 C |
| ValkeyBlackDenim | 79, 68, 60, 71 | Black C |
| ValkeyPalaceBurgundy | 39, 92, 60, 42 | 7421 C |
| ValkeyPurpleIndigo | 95, 100, 20, 14 | 2685 C |
| ValkeyCandy | 4, 45, 15, 0 | 494 C |
| ValkeySummerLavender | 24, 27, 0, 0 | 2705 C |

### 2.5 Recommended Color Proportions

For a typical Valkey composition:

- use ValkeyBestWhite, ValkeyColdCream3, or ValkeyBlackDenim for most of the
  canvas;
- use ValkeyPurpleIndigo to establish depth and hierarchy;
- use ValkeyBlueAura as the primary accent;
- use ValkeyCandy, ValkeySummerLavender, and ValkeyPalaceBurgundy sparingly for
  emphasis or illustration.

Avoid giving every supporting color equal visual weight.

### 2.6 Gradients

The canonical gradient library is defined in
[`valkey-gradients.css`](./valkey-gradients.css). Use these named tokens rather
than recreating approximate gradients. Their angles, stops, and colors are part
of each gradient definition.

Import the file and reference its custom properties:

```css
@import url("./valkey-gradients.css");

.hero {
  background: var(--valkey-dark-midnight-aura);
}

.feature-panel {
  background: var(--valkey-light-lavender-sky);
}
```

#### Light Gradients

Light gradients work best for page backgrounds, editorial panels, diagrams,
social graphics, and cards that use ValkeyBlackDenim or ValkeyPurpleIndigo
text.

| Token | Color sequence | CSS definition | Recommended use |
|---|---|---|---|
| **Ice Aura** `--valkey-light-ice-aura` | ValkeyBestWhite → ValkeyMistyIce → ValkeyBlueAura | `linear-gradient(135deg, #FFFDFA 0%, #D3DDE7 52%, #6983FF 100%)` | Technical hero backgrounds, diagrams, presentation covers |
| **Lavender Sky** `--valkey-light-lavender-sky` | ValkeyColdCream3 → ValkeySummerLavender → ValkeyBlueAura | `linear-gradient(120deg, #F7FBFE 0%, #BCB5E7 58%, #6983FF 100%)` | Community, feature, and ecosystem sections |
| **Candy Bloom** `--valkey-light-candy-bloom` | ValkeyBestWhite → ValkeyCandy → ValkeySummerLavender | `linear-gradient(145deg, #FFFDFA 0%, #E0A2AF 50%, #BCB5E7 100%)` | Events, announcements, editorial and social graphics |
| **Misty Lavender** `--valkey-light-misty-lavender` | ValkeyColdCream3 → ValkeyMistyIce → ValkeySummerLavender | `linear-gradient(105deg, #F7FBFE 0%, #D3DDE7 48%, #BCB5E7 100%)` | Documentation, quiet section backgrounds, neutral cards |
| **Candy Frost** `--valkey-light-candy-frost` | ValkeyMistyIce → ValkeyBestWhite → ValkeyCandy | `linear-gradient(160deg, #D3DDE7 0%, #FFFDFA 46%, #E0A2AF 100%)` | Warm highlights, contributor stories, secondary callouts |

#### Dark Gradients

Dark gradients work best for heroes, stage screens, title slides, section
transitions, and high-impact calls to action. Use ValkeyBestWhite or
ValkeyColdCream3 for text only after checking contrast across the complete text
area.

| Token | Color sequence | CSS definition | Recommended use |
|---|---|---|---|
| **Midnight Aura** `--valkey-dark-midnight-aura` | ValkeyBlackDenim → ValkeyPurpleIndigo → ValkeyBlueAura | `linear-gradient(135deg, #1A2026 0%, #30176E 58%, #6983FF 100%)` | Primary dark hero, campaign cover, product launch visual |
| **Blue Descent** `--valkey-dark-blue-descent` | ValkeyBlueAura → ValkeyPurpleIndigo → ValkeyBlackDenim | `linear-gradient(180deg, #6983FF 0%, #30176E 40%, #1A2026 100%)` | Full-height hero, vertical banner, section transition |
| **Indigo Pulse** `--valkey-dark-indigo-pulse` | ValkeyBlackDenim → ValkeyPurpleIndigo → ValkeyBlueAura | `linear-gradient(105deg, #1A2026 0%, #30176E 46%, #6983FF 100%)` | Wide headers, event signage, horizontal feature bands |
| **Indigo Dusk** `--valkey-dark-indigo-dusk` | ValkeyBlackDenim → ValkeyPurpleIndigo → ValkeySummerLavender | `linear-gradient(155deg, #1A2026 0%, #30176E 72%, #BCB5E7 100%)` | Editorial title card, community story, subdued dark panel |
| **Lavender Descent** `--valkey-dark-lavender-descent` | ValkeySummerLavender → ValkeyPurpleIndigo → ValkeyBlackDenim | `linear-gradient(180deg, #BCB5E7 0%, #30176E 38%, #1A2026 100%)` | Presentation title slide, portrait graphic, vertical stage screen |

#### Gradient Selection

- Use **Midnight Aura** as the default dark brand gradient.
- Use **Ice Aura** as the default light technical gradient.
- Use **Misty Lavender** when content needs a quieter background.
- Use **Candy Bloom** or **Candy Frost** for human, community, editorial, and
  event-focused material.
- Use vertical descent gradients for tall layouts and section transitions.
- Avoid placing normal-size text over the ValkeyBlueAura, ValkeyCandy, or
  ValkeySummerLavender end of a gradient without testing the exact placement.
- For long text, place content on a solid or translucent surface instead of
  directly over a multi-stop gradient.
- Do not change a named token's angle or color stops. If a new gradient is
  required, assign it a new approved token name.

For photography, apply a ValkeyPurpleIndigo overlay while keeping the image
recognizable:

```css
background:
  linear-gradient(
    to bottom,
    rgb(48 23 110 / 15%),
    rgb(48 23 110 / 80%)
  ),
  url("image.webp") center / cover;
```

Keep custom photographic treatments within the Valkey palette. Do not
introduce unrelated rainbow gradients into core Valkey materials.

### 2.7 Accessible Color Pairings

All text and essential interface graphics must meet WCAG contrast requirements:
at least 4.5:1 for normal text, 3:1 for large text, and 3:1 for meaningful
non-text controls.

Recommended pairings:

| Background | Normal text | Accent or large text |
|---|---|---|
| ValkeyBestWhite or ValkeyColdCream3 | ValkeyBlackDenim, ValkeyPurpleIndigo, or ValkeyPalaceBurgundy | ValkeyBlueAura |
| ValkeyBlackDenim | ValkeyBestWhite, ValkeyColdCream3, ValkeyCandy, ValkeySummerLavender, or ValkeyBlueAura | Logo Light |
| ValkeyPurpleIndigo | ValkeyBestWhite, ValkeyColdCream3, ValkeyCandy, or ValkeySummerLavender | ValkeyBlueAura |
| ValkeyBlueAura | ValkeyBlackDenim | ValkeyBestWhite or ValkeyPurpleIndigo only at large sizes |

Important constraints:

- ValkeyBlueAura on a light background is approximately `3.3:1`; reserve it for
  large text, controls, focus indicators, icons, and decoration.
- White on ValkeyBlueAura is also approximately `3.3:1`; do not use it for
  normal-size body text.
- ValkeyCandy and ValkeySummerLavender do not provide sufficient text contrast
  on light backgrounds.
- Never communicate status by color alone; pair color with a label, shape, or
  icon.

## 3. Typography

### 3.1 Typeface Roles

| Typeface | Role | Available files |
|---|---|---|
| Inter | Logo construction and logo-adjacent lockups only | [Inter](./Valkey-Fonts/Inter/) |
| Play | Titles, headings, hero statements, and short display copy | [Play](./Valkey-Fonts/Play/) |
| Open Sans | Body copy, navigation, labels, forms, tables, and long-form documentation | [Open Sans](./Valkey-Fonts/Open_Sans/) |
| Cascadia Code | Source code, commands, configuration, terminal output, and inline code | [Cascadia Code](./Valkey-Fonts/Cascadia_Code/) |

The logo files contain outlined artwork. Inter identifies the type family
associated with logo work; it is not permission to recreate the Valkey
wordmark.

Source Code Pro remains in the asset bundle for compatibility with older
materials, but Cascadia Code is the standard for new Valkey code samples.

### 3.2 Title Typeface — Play

- Use Play Regular (`400`) or Play Bold (`700`).
- Use Bold for hero statements, page titles, and major section headings.
- Use Regular for secondary headings when a lighter hierarchy is needed.
- Uppercase is appropriate for short hero statements and event signage.
- Avoid long paragraphs, dense tables, and small labels in Play.
- Keep tracking close to default. For uppercase display text, a small positive
  letter spacing is acceptable.

### 3.3 Body Typeface — Open Sans

- Use Regular (`400`) for body text.
- Use Semibold (`600`) for navigation, buttons, labels, and emphasis.
- Use Bold (`700`) for strong emphasis and compact subheadings.
- Prefer a `1.5` to `1.7` line height for body copy.
- Do not simulate condensed text by horizontally scaling Open Sans.

### 3.4 Code Typeface — Cascadia Code

- Use Regular (`400`) for code and Semibold (`600`) only for deliberate
  emphasis.
- Disable programming ligatures where exact character recognition matters.
- Keep code left-aligned and preserve whitespace.
- Use a minimum of `14px` in dense interfaces and prefer `16px` in
  documentation and presentations.

```css
code,
pre,
kbd,
samp {
  font-family: "Cascadia Code", "SFMono-Regular", Consolas, monospace;
  font-variant-ligatures: none;
}
```

### 3.5 Recommended Digital Type Scale

The scale preserves the proportions used by the Valkey website while assigning
Play to titles and Open Sans to reading text.

| Style | Mobile | Desktop | Typeface and weight | Line height |
|---|---:|---:|---|---:|
| Hero title | 40 px | 70 px | Play Bold | 1.0–1.1 |
| Section display | 38 px | 60 px | Play Bold | 1.1–1.2 |
| Page title / H1 | 32 px | 40 px | Play Bold | 1.1–1.2 |
| H2 | 24 px | 32 px | Play Bold | 1.2 |
| H3 | 20 px | 24 px | Play Bold or Regular | 1.2–1.3 |
| Body | 18 px | 18 px | Open Sans Regular | 1.5–1.7 |
| Navigation / button | 16 px | 16 px | Open Sans Semibold | 1.2–1.4 |
| Caption / metadata | 14 px | 14–15 px | Open Sans Regular | 1.4–1.5 |
| Code | 14 px | 16 px | Cascadia Code Regular | 1.5–1.6 |

### 3.6 Web Font Setup

Use WOFF2 on the web. A minimal setup is:

```css
@font-face {
  font-family: "Play";
  src: url("./Valkey-Fonts/Play/Play-Regular.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Play";
  src: url("./Valkey-Fonts/Play/Play-Bold.woff2") format("woff2");
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}

@font-face {
  font-family: "Open Sans";
  src: url("./Valkey-Fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.woff2")
    format("woff2");
  font-style: normal;
  font-weight: 300 800;
  font-display: swap;
}

@font-face {
  font-family: "Cascadia Code";
  src: url("./Valkey-Fonts/Cascadia_Code/CascadiaCode-VariableFont_wght.woff2")
    format("woff2");
  font-style: normal;
  font-weight: 200 700;
  font-display: swap;
}

:root {
  --font-display: "Play", "Arial Narrow", sans-serif;
  --font-body: "Open Sans", "Segoe UI", sans-serif;
  --font-code: "Cascadia Code", "SFMono-Regular", Consolas, monospace;
}
```

The font directories include their license files. Preserve those files when
redistributing the fonts.

## 4. Digital Design Language

### 4.1 Layout

The Valkey website establishes these practical layout conventions:

- maximum page width: `1400px`;
- hero content width: up to `1200px`;
- readable prose and intro copy: generally no wider than `800–890px`;
- primary responsive breakpoints: `768px`, `1024px`, and `1400px`;
- a common spacing rhythm based on `10px`, with frequent `20px`, `30px`,
  `40px`, and `80px` intervals.

Use generous whitespace and reduce columns before reducing type size.

### 4.2 Shape

Rounded geometry is a recognizable part of the current Valkey digital system:

| Element | Recommended radius |
|---|---:|
| Large content card or section panel | 18–20 px |
| Inner card or code block | 8–10 px |
| Compact control | 4–8 px |
| Pill button or tag | 24–30 px, or 50% of control height |
| Avatar or circular icon field | 50% |

Use square corners when required by a technical diagram, data table, terminal,
or third-party interface. Do not round every nested element.

### 4.3 Cards

Default cards use:

- a light surface;
- `20–30px` internal padding;
- a subtle border or blue-tinted shadow;
- a clear title, concise body, and one primary action;
- consistent height within a row where practical.

Dark cards may use ValkeyPurpleIndigo or the website's deep-purple surface
`#2D2471`, with ValkeyBestWhite or ValkeyColdCream3 text.

### 4.4 Buttons and Links

- Use sentence case for most buttons; uppercase may be used for short hero
  calls to action.
- Primary buttons may use ValkeyBlackDenim, ValkeyPurpleIndigo, or a light
  button on a dark hero.
- ValkeyBlueAura is appropriate for borders, focus rings, icons, and large
  button labels when contrast is sufficient.
- Use a visible hover and keyboard-focus treatment; do not rely only on a small
  color shift.
- Underline links in body copy or otherwise make them distinguishable without
  color alone.

### 4.5 Tables

- Use ValkeyPurpleIndigo with white text for high-emphasis table headers.
- Use ValkeyBlackDenim text on light rows.
- Use ValkeyMistyIce or an equivalent neutral for borders.
- Keep alternating row backgrounds subtle.
- Never use ValkeyCandy, ValkeySummerLavender, or ValkeyBlueAura as normal-size
  table text on a light background.

### 4.6 Icons

- Prefer simple, recognizable icons with consistent stroke weight or a
  consistent solid style.
- Use the Valkey icon only for Valkey identity, not as a generic database,
  security, or navigation symbol.
- Typical interface icon sizes are `16–24px`; feature-card icons may be
  `40–48px`.
- Keep third-party and social logos faithful to their owners' brand
  requirements.
- Supply text labels for unfamiliar icons and accessible names for actionable
  icons.

### 4.7 Photography and Illustration

- Favor imagery that feels technical, open, collaborative, and human.
- Use ValkeyPurpleIndigo overlays to integrate photography with the Valkey
  palette.
- Keep diagrams clean and high contrast, with ValkeyBlueAura as the primary
  connective accent.
- Use ValkeyCandy and ValkeySummerLavender for secondary nodes or highlights,
  not for dense text.
- Avoid generic neon gradients, glossy 3D decoration, and unnecessary visual
  noise.

## 5. Code Samples

Use Cascadia Code for all code, commands, and terminal output.

### 5.1 Dark Code Theme

| Token | Color |
|---|---|
| Background | ValkeyBlackDenim `#1A2026` |
| Default text | ValkeyColdCream3 `#F7FBFE` |
| Keyword | ValkeyCandy `#E0A2AF` |
| Definition, number, prompt, or focus | ValkeyBlueAura `#6983FF` |
| String | ValkeyMistyIce `#D3DDE7` |
| Comment | ValkeySummerLavender `#BCB5E7` |
| Operator and punctuation | ValkeyColdCream3 `#F7FBFE` |

### 5.2 Light Code Theme

| Token | Color |
|---|---|
| Background | ValkeyColdCream3 `#F7FBFE` |
| Default text | ValkeyBlackDenim `#1A2026` |
| Keyword and definition | ValkeyPurpleIndigo `#30176E` |
| String and number | ValkeyPalaceBurgundy `#642637` |
| Comment | ValkeyPalaceBurgundy `#642637` with italic styling |
| Selection, focus, or active line | a light tint of ValkeyBlueAura |
| Operator and punctuation | ValkeyBlackDenim `#1A2026` |

These mappings favor readability. Do not use ValkeyPalaceBurgundy as small text
on ValkeyBlackDenim or ValkeyCandy as small text on a light background.

Recommended container:

```css
pre {
  margin: 1.5rem 0;
  padding: 2rem;
  overflow-x: auto;
  border: 1px solid #D3DDE7;
  border-radius: 10px;
  background: #1A2026;
  color: #F7FBFE;
  font: 400 16px/1.6 "Cascadia Code", monospace;
  font-variant-ligatures: none;
}
```

## 6. Brand Voice and Writing

Valkey communication should be:

- **direct:** lead with what the reader can do or needs to know;
- **technical but readable:** use exact terminology and explain unfamiliar
  concepts plainly;
- **evidence-based:** support performance and reliability claims with data;
- **community-centered:** recognize contributors and the open-source project;
- **confident, not inflated:** avoid unsupported superlatives and sales-heavy
  language.

Writing conventions:

- Write the project name as **Valkey**, not `VALKEY`, except when the surrounding
  design intentionally uses all-uppercase display text.
- Use **Valkey.io** only when referring specifically to the website.
- Use **open source** without a hyphen, following current project usage.
- Use **high-performance** before a noun.
- Preserve exact capitalization, commands, configuration keys, and output in
  technical examples.
- Prefer short headings and descriptive link text.

## 7. Accessibility

- Meet WCAG AA contrast at minimum.
- Preserve visible keyboard focus.
- Do not use color as the only source of meaning.
- Provide alt text that communicates purpose. For a linked home logo, `Valkey`
  is usually sufficient; use empty alt text when a repeated logo is purely
  decorative.
- Respect text resizing and reflow at narrow widths.
- Avoid embedding essential text inside raster images.
- Add captions or transcripts to meaningful audio and video.
- Keep animation optional and respect `prefers-reduced-motion`.

## 8. Website Implementation Guidance

The September 2026 review of `valkey-io/valkey-io.github.io` found a strong
existing visual direction:

- the horizontal logo is used in the header at approximately `130 × 46px`;
- ValkeyBlackDenim is used for the footer;
- ValkeyBlueAura and ValkeyPurpleIndigo lead the homepage, documentation,
  community, and participant sections;
- purple-to-blue gradients, `20px` cards, pill controls, and a `1400px`
  maximum layout width recur across the site;
- the interface is mobile-first, with major changes around `768px` and
  `1024px`.

The same review also found legacy implementation details that should not be
treated as new brand standards:

- headings currently inherit Open Sans instead of Play;
- code currently falls back to Fira Mono instead of Cascadia Code;
- the stylesheet includes older Linux Foundation blue, green, yellow, red, and
  gray token sets;
- some components introduce one-off purple, blue, and neutral values;
- some normal-size white text appears on ValkeyBlueAura, which does not meet
  the `4.5:1` contrast target.

For new work, follow this guideline's font roles, canonical palette, semantic
tokens, and contrast rules. Existing legacy values may be migrated
incrementally; this document does not require unrelated pages to be redesigned
at once.

### 8.1 Recommended Semantic Tokens

```css
:root {
  --valkey-blue-aura: #6983FF;
  --valkey-black-denim: #1A2026;
  --valkey-palace-burgundy: #642637;
  --valkey-purple-indigo: #30176E;
  --valkey-candy: #E0A2AF;
  --valkey-summer-lavender: #BCB5E7;
  --valkey-best-white: #FFFDFA;
  --valkey-misty-ice: #D3DDE7;
  --valkey-cold-cream-3: #F7FBFE;

  --color-canvas: var(--valkey-best-white);
  --color-surface: var(--valkey-cold-cream-3);
  --color-border: var(--valkey-misty-ice);
  --color-text: var(--valkey-black-denim);
  --color-heading: var(--valkey-purple-indigo);
  --color-accent: var(--valkey-blue-aura);
  --color-dark-surface: var(--valkey-black-denim);
  --color-on-dark: var(--valkey-cold-cream-3);

  --font-display: "Play", sans-serif;
  --font-body: "Open Sans", sans-serif;
  --font-code: "Cascadia Code", monospace;

  --layout-max: 1400px;
  --content-max: 890px;
  --radius-card: 20px;
  --radius-inner: 10px;
  --radius-pill: 999px;
}
```

## 9. Asset Directory

### Logos

- [Horizontal SVG logos](./logo-svgs/)
- [Raster PNG logos](./logo-pngs/)
- [Valkey icon — periwinkle](./logo-svgs/valkey-icon-periwinkle.svg)
- [Valkey icon — black](./logo-svgs/valkey-icon-black.svg)
- [Valkey icon — white](./logo-svgs/valkey-icon-white.svg)

### Fonts

- [Inter](./Valkey-Fonts/Inter/)
- [Play](./Valkey-Fonts/Play/)
- [Open Sans](./Valkey-Fonts/Open_Sans/)
- [Cascadia Code](./Valkey-Fonts/Cascadia_Code/)

### Gradients

- [Canonical CSS gradient tokens](./valkey-gradients.css)

## 10. Trademark and Attribution

Valkey and the Valkey logo are trademarks of LF Projects, LLC.

Logo design by [Ziyang](https://github.com/dizys).

For trademark use, naming, endorsement, and attribution requirements, review
the [LF Projects Trademark Policy](https://lfprojects.org/policies/trademark-policy/).
