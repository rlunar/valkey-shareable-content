One-line: the Valkey card — light surface with a blue-tinted shadow, or a dark #2D2471 panel for homepage documentation cards.

```jsx
<Card surface="dark" padding="lg" title="Install"
  description="Step-by-step instructions on how to install and configure Valkey for first-time users."
  actions={<Button variant="outline-dark" fullWidth>See Installation Guide</Button>} />
```

Surfaces: `light` (20px radius + `0 4px 24px rgba(105,131,255,.10)`), `light-bordered` (10px + hairline), `light-square` (blog article body), `dark` (#2D2471), `indigo` (ValkeyPurpleIndigo), `translucent` (white 20% over a gradient band). Titles center on dark surfaces and left-align on light, matching the source. Use `raiseOnHover` for grids of community/leadership cards.
