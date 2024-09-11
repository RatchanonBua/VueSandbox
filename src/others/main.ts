/* eslint-disable @typescript-eslint/no-unused-vars */
import '@/assets/others/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/router/others/index'

import $ from 'jquery'

$(function ($) {
  console.log('Document Ready')
  console.log($)
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
