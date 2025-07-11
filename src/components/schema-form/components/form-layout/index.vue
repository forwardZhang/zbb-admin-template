<template>
  <el-row :gutter="16">
    <el-col v-for="field in schema" :span="field.span ?? 24" :key="field.name">
      <slot name="item" :field="field"></slot>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
  defineProps({
    schema: {
      type: Array,
      required: true,
    },
  });
</script>
