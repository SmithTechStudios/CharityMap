import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import ui from '@nuxt/ui/vue-plugin'
import { resolveCharities } from './resolveDataSource'

const el = document.getElementById('charity-map') ?? document.getElementById('app')

if (el) {
  el.classList.add('charity-map-root')

  const app = createApp(App)
  app.provide('getCharities', () => resolveCharities(el))
  app.use(ui)
  app.mount(el)
}
