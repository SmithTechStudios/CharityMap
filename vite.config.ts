import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import ui from '@nuxt/ui/vite'

export default defineConfig(({ command, mode }) => ({
  base: mode === 'production' ? '/CharityMap/' : '/',
  plugins: [
    vue(),
    ...(command === 'serve' ? [vueDevTools()] : []),
    tailwindcss(),
    ui(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
