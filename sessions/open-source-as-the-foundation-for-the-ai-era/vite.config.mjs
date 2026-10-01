import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

const projectDirectory = dirname(fileURLToPath(import.meta.url))
// This deck lives at <repo_root>/sessions/<deck>, so climb two levels.
const repositoryRoot = resolve(projectDirectory, '..', '..')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectDirectory, '')

  return {
    publicDir: resolve(projectDirectory, 'assets/public'),
    define: {
      __PRESENTER_NAME__: JSON.stringify(env.SPEAKER || ''),
      __PRESENTER_TITLE__: JSON.stringify(env.TITLE || ''),
      __PRESENTER_COMPANY__: JSON.stringify(env.COMPANY || ''),
    },
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
  }
})
