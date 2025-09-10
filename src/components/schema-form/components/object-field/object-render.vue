<template>
  <template v-if="schema.inline">
    <template v-for="field in schema.fields" :key="field.name">
      <SchemaFormItem :schema="field" :path="path" v-model="modelValue[field.name]" />
    </template>
  </template>
  <el-row :gutter="24" v-else>
    <el-col v-for="field in schema.fields" :key="field.name" :span="field.span || 24">
      <SchemaFormItem :schema="field" :path="path" v-model="modelValue[field.name]" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
  import type { ObjectSchema, Schema } from '@/components/schema-form/types.ts';
  import SchemaFormItem from '@/components/schema-form/components/schema-form-item.vue';

  const props = defineProps<{
    schema: ObjectSchema;
    path: string;
  }>();
  const modelValue = defineModel<any>({ default: () => ({}) });
</script>

<style scoped lang="scss"></style>
