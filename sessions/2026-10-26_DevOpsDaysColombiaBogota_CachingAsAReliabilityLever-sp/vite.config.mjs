import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

const projectDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(projectDirectory, '..', '..')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectDirectory, '')

  return {
    publicDir: resolve(projectDirectory, 'assets/public'),
    define: {
      __PRESENTER_NAME__: JSON.stringify(env.SPEAKER || 'Roberto Luna Rojas'),
      __PRESENTER_TITLE__: JSON.stringify(env.TITLE || 'Sr. Open Source Developer Advocate'),
      __PRESENTER_COMPANY__: JSON.stringify(env.COMPANY || 'AWS'),
    },
    resolve: {
      alias: {
        '@valkey-assets': resolve(repositoryRoot, 'valkey-brand/ValkeyDesignSystem/assets'),
        '@valkey-slide-icons': resolve(repositoryRoot, 'valkey-brand/icons'),
      },
    },
    server: {
      fs: {
        allow: [repositoryRoot],
      },
    },
  }
})
