/*
 * @Author: Wjh
 * @Date: 2022-12-04 21:28:12
 * @LastEditors: Wjh
 * @LastEditTime: 2022-12-29 13:38:02
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
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/show",
      component: () => import("../views/Show.vue"),
    },
    // {
    //   path: "/arco",
    //   component: () => import("../views/ArcoTest.vue"),
    // },
  ],
});

export default router;
