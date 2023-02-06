<!--
 * @Author: Wjh
 * @Date: 2023-01-11 17:10:32
 * @LastEditors: Wjh
 * @LastEditTime: 2023-02-06 17:29:34
 * @FilePath: \my-vue3-project\src\views\AboutView.vue
 * @Description: 
 * 
-->
<template>
  <div id="canvas3"></div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue'
import Funcs from '@/service/funcs'

onMounted(() => {
  new Funcs();
})

</script>