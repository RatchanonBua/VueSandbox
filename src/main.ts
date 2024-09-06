import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
// import Lessons from './Lessons.vue'
// import Sandbox from './Sandbox.vue'
import router from './router'

import $ from 'jquery'

$(function ($) {
  console.log('Document Ready')
  console.log($)
})

const app = createApp(App)
// const app = createApp(Lessons)
// const app = createApp(Sandbox)

app.use(createPinia())
app.use(router)

app.mount('#app')
