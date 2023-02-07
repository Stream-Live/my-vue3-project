<template>
  <div id="canvas" />
</template>

<script lang="ts" setup>

import Test from "@/service/index";
import { onMounted } from "vue";

onMounted(() => {
  new Test();
})
</script>

<style>
#canvas {
  width: 100%;
  height: 100%;
}
#app {
  margin: 0 !important;
  padding: 0 !important;
}
</style>