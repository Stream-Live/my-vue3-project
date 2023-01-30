/*
 * @Author: Wjh
 * @Date: 2022-12-04 21:28:12
 * @LastEditors: Wjh
 * @LastEditTime: 2022-12-29 16:50:13
 * @FilePath: \my-vue3-project\src\stores\index.ts
 * @Description:
 *
 */
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useStore = defineStore("loading", {
  state: () => {
    return {
      isLoading: false,
    };
  },
});
