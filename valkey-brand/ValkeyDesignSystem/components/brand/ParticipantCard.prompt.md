One-line: a participant organization tile, three across in the homepage carousel.

```jsx
<ParticipantCard name="Amazon Web Services" logoSrc="assets/participants/aws.svg"
  offering="Amazon ElastiCache and Amazon MemoryDB support Valkey." href="https://aws.amazon.com" />
```

Logos are `object-fit: contain` and never stretched; participant marks belong to their owners, so keep them as supplied. Falls back to a two-letter circle when no logo file exists.
