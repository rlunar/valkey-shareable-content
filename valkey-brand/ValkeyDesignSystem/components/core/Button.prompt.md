One-line: the Valkey button — use `hero` for the one big page CTA, `outline` for everything else, `solid` only when matching legacy pages.

```jsx
<Button variant="hero" size="lg" href="/topics/quickstart">GET STARTED</Button>
<Button variant="outline" size="sm">Read More</Button>
<Button variant="outline-dark">See Installation Guide</Button>
```

Variants: `hero` (gradient pill, 30px radius, drop shadow — min-width 380px on desktop in the real hero), `outline` (hairline pill, fills with ValkeyBlueAura on hover), `outline-dark` (on #2D2471 cards, `1px solid currentColor`), `outline-ink` (#072150 community card style), `solid` (legacy 5px-radius rectangle), `ghost`. Sizes sm/md/lg map to 14/16/22px labels. Sentence case labels; ALL CAPS only for a hero CTA.
