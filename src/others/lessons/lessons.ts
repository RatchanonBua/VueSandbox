/* eslint-disable @typescript-eslint/no-unused-vars */
import '../../assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Lessons from './Lessons.vue'
import router from '../../router'

import $ from 'jquery'

$(function ($) {
  console.log('Document Ready')
  console.log($)
})

const app = createApp(Lessons)

app.use(createPinia())
app.use(router)

app.mount('#app')
