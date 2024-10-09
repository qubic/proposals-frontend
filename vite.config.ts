import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
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
})
