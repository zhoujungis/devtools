import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import { categories } from './src/data/categories'

const ssgOptions = {
  includedRoutes(_paths: string[], routes: { path: string }[]) {
    return routes.flatMap(r => {
      if (r.path === '/category/:id') return categories.map(c => `/category/${c.id}`)
      if (r.path.includes(':pathMatch')) return []
      return r.path
    })
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'robots.txt', 'theme-init.js', 'icons/*.png'],
      manifest: {
        name: 'DevBox · 程序员工具箱',
        short_name: 'DevBox',
        description: '快速、免费、隐私优先的程序员在线工具箱，包含开发、编码、安全、网络诊断和 AI 代码风格分析工具',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' as any }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  ...({ ssgOptions } as Record<string, unknown>),
  ssr: {
    noExternal: true
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    target: 'esnext',
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              vendor: ['vue', 'vue-router', 'pinia'],
              codemirror: [
                '@codemirror/view',
                '@codemirror/state',
                '@codemirror/commands',
                '@codemirror/language'
              ]
            }
          }
        }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,js}', 'tests/**/*.{test,spec}.{ts,js}']
  } as any
}))
