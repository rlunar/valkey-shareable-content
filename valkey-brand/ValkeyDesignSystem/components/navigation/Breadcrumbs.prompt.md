One-line: breadcrumbs on documentation topic pages.

```jsx
<Breadcrumbs caretSrc="assets/icons/caret-right.svg"
  items={[{ label: "Topics", href: "/topics/" }, { label: "Quick start" }]} />
```

The current page is plain text with `aria-current="page"`; ancestors are #2054B2 semibold underlined. Separator is the 8x10 caret SVG, never a slash character.
