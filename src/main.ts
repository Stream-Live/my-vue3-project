/*
 * @Author: Wjh
 * @Date: 2022-12-04 21:28:12
 * @LastEditors: Wjh
 * @LastEditTime: 2022-12-20 21:33:10
 * @FilePath: \my-vue3-project\src\main.ts
 * @Description:
 *
 */
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";

const app = createApp(App);
app.use(ArcoVue);

app.use(createPinia());
app.use(router);

app.mount("#app");
