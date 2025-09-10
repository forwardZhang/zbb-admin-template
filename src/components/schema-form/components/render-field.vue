<template>
  <SchemaFormItem :schema="schema" :path="path" v-model="modelValue" />
</template>

<script setup lang="ts">
  import type { Schema } from '../types';
  import SchemaFormItem from './schema-form-item.vue';

  const props = defineProps<{
    schema: Schema;
    path?: string;
  }>();
  const modelValue = defineModel<any>();
</script>

<style scoped></style>
