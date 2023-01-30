<!--
 * @Author: Wjh
 * @Date: 2022-12-04 21:28:12
 * @LastEditors: Wjh
 * @LastEditTime: 2022-12-29 16:48:00
 * @FilePath: \my-vue3-project\src\views\AboutView.vue
 * @Description: 
 * 
-->
<script setup lang="ts">

import Test from "@/service/index";
import { onMounted } from "vue";

import { useStore } from "@/stores/index";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import Show from '@/service/show'

const store = useStore();
const isLoading = storeToRefs(store).isLoading;

onMounted(() => {
  new Test();
});
</script>

<template>
  <a-spin dot tip="加载中..." :loading="isLoading">
   <div id="canvas" />
 </a-spin>
</template>

<style>
#canvas {
  width: 100%;
  height: 100%;
}
#app {
  margin: 0 !important;
  padding: 0 !important;
}
.arco-spin-mask{
  background-color: #fff!important;
}
</style>
