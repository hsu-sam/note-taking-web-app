import "./assets/css/main.css";

import { createApp } from "vue";
import App from "./App.vue";

import { router } from "./router";
import { icon } from "./plugins/icon";

const savedFontTheme = localStorage.getItem("font-theme");

if (
  savedFontTheme === "sans-serif" ||
  savedFontTheme === "serif" ||
  savedFontTheme === "monospace"
) {
  document.documentElement.dataset.fontTheme = savedFontTheme;
}

createApp(App).use(router).use(icon).mount("#app");
