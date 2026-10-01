One-line: renders one of the 14 SVG icons the site actually ships.

```jsx
<Icon name="github" size={16} base="assets/icons/" />
<Icon name="bug" size={48} base="assets/icons/" alt="Report Bugs" />
```

Two scales only: 16-24px interface, 40-48px feature cards. Social marks stay faithful to their owners' brands — do not recolor them. Decorative icons take `alt=""`; actionable ones need a real accessible name. No emoji substitutes.
