/* eslint-disable @typescript-eslint/no-unused-vars */
import '../../assets/sandbox.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Sandbox from './Sandbox.vue'
import router from '../../router'

import $ from 'jquery'

$(function ($) {
  console.log('Document Ready')
  console.log($)
})

const app = createApp(Sandbox)

app.use(createPinia())
app.use(router)

app.mount('#app')
