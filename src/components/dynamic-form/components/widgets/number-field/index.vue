<template>
  <el-input-number
    controls-position="right"
    v-model="modelValue"
    clearable
    v-bind="componentProps"
  ></el-input-number>
</template>

<script setup lang="ts">
  const props = defineProps<{
    componentProps?: any;
  }>();
  const modelValue = defineModel<number | undefined>({
    default: undefined,
    set(value) {
      return value;
    },
  });
</script>

<style scoped lang="scss"></style>
