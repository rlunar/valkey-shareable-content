One-line: renders official Valkey logo artwork — pick the variant made for the background instead of recoloring.

```jsx
<Logo variant="horizontal-color" width={260} base="assets/logos/" href="/" />
<Logo variant="stacked-color-light" width={200} base="assets/logos/" />
<Logo variant="icon-periwinkle" width={40} base="assets/logos/" />
```

Light backgrounds → `*-color`; dark/purple/photographic → `*-color-light` or `*-white`; one-color print → `*-black`. The website header uses the horizontal mark at 130x46. Never rebuild the wordmark in Inter, never add effects, never use the icon as a generic database or navigation symbol.
