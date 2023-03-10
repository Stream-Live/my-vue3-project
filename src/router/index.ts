/*
 * @Author: Wjh
 * @Date: 2022-12-04 21:28:12
 * @LastEditors: Wjh
 * @LastEditTime: 2023-02-07 09:51:15
 * @FilePath: \my-vue3-project\src\router\index.ts
 * @Description:
 *
 */
import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      component: () => import("../views/Exhibition.vue"),
    },
    {
      path: "/show",
      component: () => import("../views/Show.vue"),
    },
    {
      path: "/funcs",
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
