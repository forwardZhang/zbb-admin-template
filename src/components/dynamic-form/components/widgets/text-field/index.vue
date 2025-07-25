<template>
  <el-input v-model="modelValue" type="text" clearable v-bind="componentProps"></el-input>
</template>

<script setup lang="ts">
  const props = defineProps<{
    componentProps?: any;
  }>();
  const modelValue = defineModel<string>({
    default: '',
    set(value) {
      return value;
    },
  });
</script>

<style scoped lang="scss"></style>
