import react from '@vitejs/plugin-react'
import path from 'path'
import type { UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'
import { qliApiProxy } from './dev-proxy.config'

const defaultConfig: UserConfig = {
  plugins: [react(), svgr()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  base: './',
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src')
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())

  if (command === 'serve' && (mode === 'development' || env.VITE_ENABLE_PROXY === 'true')) {
    return {
      ...defaultConfig,
      server: {
        proxy: {
          '/dev-proxy-qli-api': qliApiProxy
        }
      }
    }
  }

  return defaultConfig
})
