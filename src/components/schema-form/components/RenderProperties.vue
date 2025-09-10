<template>
  <div class="render-properties">
    <SchemaFormItem
      v-for="(schemaItem, index) in properties"
      :key="`${schemaItem.field}-${index}`"
      :schema="schemaItem"
      :field="parentField ? `${parentField}.${schemaItem.field}` : schemaItem.field"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Schema } from '../types';
  import SchemaFormItem from './SchemaFormItem.vue';
  import { computed } from 'vue';

  const props = defineProps<{
    properties: Schema[];
    parentField?: string;
  }>();
</script>

<style scoped>
  .render-properties {
  }
</style>
