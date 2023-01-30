<!--
 * @Author: Wjh
 * @Date: 2022-12-04 21:28:12
 * @LastEditors: Wjh
 * @LastEditTime: 2022-12-29 16:41:08
 * @FilePath: \my-vue3-project\src\views\HomeView.vue
 * @Description: 
 * 
-->
<script setup lang="ts">
// import Transition from "@/service/transition";
// import { onMounted } from "@vue/runtime-core";
// import { useStore } from "@/stores/index";
// import { storeToRefs } from "pinia";
// import { ref } from "vue";

// const store = useStore();
// const isLoading = storeToRefs(store).isLoading;

// let controller: Transition;
// onMounted(() => {
//   controller = Transition.getInstance();
// });

// const list = ["tashan", "shaxi", "jingling"];
// let cur = 0;
// const handleChange = () => {
//   controller.changeScene(list[++cur % 3]);
// };
</script>

<template>
  <!-- <a-spin dot tip="加载中..." :loading="isLoading">
    <div id="canvas2" />
  </a-spin> -->

  <a-button>转到下一个场景</a-button>
</template>

<style lang="less" scoped>
#canvas2 {
  width: 100%;
  height: 100%;
}
.arco-btn {
  position: absolute;
  top: 0;
}
.arco-spin {
  transition: all 0.5s linear;
}
</style>
