import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const projectDirectory = dirname(fileURLToPath(import.meta.url))
// This deck lives at <repo_root>/sessions/valkey-slidev, so climb two levels.
const repositoryRoot = resolve(projectDirectory, '..', '..')

export default defineConfig({
  resolve: {
    alias: {
      '@valkey-assets': resolve(repositoryRoot, 'valkey-brand/ValkeyDesignSystem/assets'),
      '@valkey-slide-icons': resolve(repositoryRoot, 'slides/icons'),
    },
  },
  server: {
    fs: {
      allow: [repositoryRoot],
    },
  },
})
