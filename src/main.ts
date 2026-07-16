import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import ui from '@nuxt/ui/vue-plugin'
import { resolveDataSource } from './resolveDataSource'
import type { CharityDataSource } from './useCharities'

const el = document.getElementById('charity-map') ?? document.getElementById('app')

if (el) {
  let dataSource: CharityDataSource
  try {
    dataSource = resolveDataSource(el)
  } catch (e) {
    console.error('Failed to parse charity data:', e)
    dataSource = { type: 'url', url: '/sample-charities.json' }
  }

  const app = createApp(App)
  app.provide('dataSource', dataSource)
  app.use(ui)
  app.mount(el)
}
