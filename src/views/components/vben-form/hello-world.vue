<template>
  <div class="container">hello world1{{ model }} <el-input v-model="model"></el-input></div>
</template>

<script setup lang="ts">
  import { useAttrs } from 'vue';

  const model = defineModel<any>();
  setTimeout(() => {
    model.value = model.value + 1;
  }, 1000);
  const attr = useAttrs();
  console.log('attr', attr);
</script>

<style scoped></style>
