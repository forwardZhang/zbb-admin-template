<template>
  <FormItem :field="field">
    <div class="array-field">
      <div v-for="(item, index) in items" :key="index" class="array-item">
        <FieldRender :fields="[itemSchemaWithIndex(index)]" />
        <el-button @click="removeItem(index)">删除</el-button>
      </div>
      <el-button @click="addItem">添加一项</el-button>
    </div>
  </FormItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { get, set } from 'lodash-es';
  import FieldRender from '../../field-render.vue';
  import FormItem from '../../form-item.vue';
  import { injectFormApi } from '../../../hooks/use-form-context.ts';
  import type { ArrayFormSchema, FormSchema } from '@/components/dynamic-form/types';

  const props = defineProps<{
    field: ArrayFormSchema;
  }>();
  const formApi: any = injectFormApi<any>();
  const { formValues } = formApi;

  const items = computed(() => {
    return get(formValues, props.field.fieldName, []);
  });

  const itemSchemaWithIndex = (index: number): FormSchema => {
    return {
      ...props.field.items,
      fieldName: `${props.field.fieldName}[${index}]`,
    };
  };

  const addItem = () => {
    const currentItems = [...items.value];
    const defaultValue = props.field.getDefaultValue?.() || '';
    currentItems.push(defaultValue);
    console.log('props.field.fieldName', props.field.fieldName);
    set(formValues, props.field.fieldName, currentItems);
  };

  const removeItem = (index: number) => {
    const currentItems = [...items.value];
    currentItems.splice(index, 1);
    set(formValues, props.field.fieldName, currentItems);
  };
</script>
