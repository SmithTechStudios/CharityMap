import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import ui from '@nuxt/ui/vue-plugin'

const el = document.getElementById('charity-map') ?? document.getElementById('app')
if (el) {
  const dataUrl = el.dataset.src || '/sample-charities.json'
  const app = createApp(App)
  app.provide('dataUrl', dataUrl)
  app.use(ui)
  app.mount(el)
}
