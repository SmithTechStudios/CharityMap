import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import ui from '@nuxt/ui/vite'

function cssInjectedByJs(): Plugin {
  return {
    name: 'css-injected-by-js',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const cssChunks: string[] = []

      for (const [key, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'asset' && key.endsWith('.css')) {
          cssChunks.push(String(chunk.source))
          delete bundle[key]
        }
      }

      if (cssChunks.length === 0) return

      const css = cssChunks.join('\n')
      const escaped = css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
      const injection = `(function(){var s=document.createElement('style');s.textContent=\`${escaped}\`;document.head.appendChild(s)})();`

      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && chunk.isEntry) {
          chunk.code = injection + chunk.code
          break
        }
      }
    },
  }
}

export default defineConfig(({ command, mode }) => ({
  base: mode === 'production' ? '/CharityMap/' : '/',
  plugins: [
    vue(),
    ...(command === 'serve' ? [vueDevTools()] : []),
    tailwindcss(),
    ui(),
    cssInjectedByJs(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: fileURLToPath(new URL('./src/main.ts', import.meta.url)),
      name: 'CharityMapEmbed',
      formats: ['iife'],
      fileName: () => 'charity-map.js',
    },
  },
}))
