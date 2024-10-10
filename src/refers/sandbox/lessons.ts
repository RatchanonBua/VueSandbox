/* eslint-disable @typescript-eslint/no-unused-vars */
import "@/refers/assets/sandbox.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import Lessons from "./Lessons.vue";
import router from "@/refers/router/sandbox";

import $ from "jquery";

$(function ($) {
  console.log("Document Ready");
  console.log($);
});

const app = createApp(Lessons);

app.use(createPinia());
app.use(router);

app.mount("#app");
