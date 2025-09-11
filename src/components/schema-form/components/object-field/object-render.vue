<template>
  <template v-if="schema.inline">
    <template v-for="field in schema.fields" :key="field.name">
      <SchemaFormItem :schema="field" :path="path" v-model="modelValue[field.name]" />
    </template>
  </template>
  <el-row :gutter="18" v-else>
    <el-col v-for="field in schema.fields" :key="field.name" :span="field.span || 24">
      <SchemaFormItem :schema="field" :path="path" v-model="modelValue[field.name]" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
  import SchemaFormItem from '@/components/schema-form/components/schema-form-item.vue';
  import type { ObjectSchema, Schema } from '@/components/types/Form.ts';

  const props = defineProps<{
    schema: ObjectSchema;
    path: string;
  }>();
  const modelValue = defineModel<any>({ default: () => ({}) });
</script>

<style scoped lang="scss"></style>
