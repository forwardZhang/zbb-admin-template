<template>
  <el-row :gutter="16">
    <el-col v-for="field in fields" :key="field.fieldName" :span="field.span ?? 24">
      <FormField :field="field" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';
  import FormField from './form-field.vue';

  defineProps<{
    fields: any[];
  }>();
</script>
