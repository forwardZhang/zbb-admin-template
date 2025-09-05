<template>
  <el-select v-model="modelValue" clearable v-bind="componentProps"></el-select>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const props = defineProps<{
    componentProps?: any;
  }>();
  const modelValue = defineModel<any>({
    default: undefined,
    set(value) {
      return value;
    },
  });
  const sourceOptions = ref([]);
</script>

<style scoped lang="scss"></style>
