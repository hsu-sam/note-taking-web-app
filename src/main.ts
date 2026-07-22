import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

import { router } from "./router";
import { icon } from "./plugins/icon";

createApp(App).use(router).use(icon).mount("#app");
