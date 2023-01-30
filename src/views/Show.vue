<!--
 * @Author: Wjh
 * @Date: 2022-12-26 11:57:05
 * @LastEditors: Wjh
 * @LastEditTime: 2022-12-29 16:46:09
 * @FilePath: \my-vue3-project\src\views\Show.vue
 * @Description: 
 * 
-->
<template>
  <div id="canvas2"></div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue'
import Show from '@/service/show'

onMounted(() => {
  new Show();
})

</script>
