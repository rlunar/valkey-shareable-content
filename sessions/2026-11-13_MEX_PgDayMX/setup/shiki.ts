// Monokai for every code sample, matching the other Valkey decks.
// `@slidev/types` is not hoisted by pnpm in this workspace, so export the options object directly;
// Slidev only needs a function (or object) that returns the Shiki options.
export default () => ({
  theme: 'monokai',
  langs: ['sql', 'java', 'bash', 'yaml', 'properties', 'text'],
})
