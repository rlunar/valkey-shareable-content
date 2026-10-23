// Monokai for every code sample in the deck (the user asked for Monokai or Catppuccin).
// `@slidev/types` is not hoisted by pnpm in this workspace, so export the options object directly;
// Slidev only needs a function (or object) that returns the Shiki options.
export default () => ({
  theme: 'monokai',
  langs: ['python', 'bash'],
})
