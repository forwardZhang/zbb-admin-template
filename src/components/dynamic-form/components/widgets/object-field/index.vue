<!-- object-field/index.vue -->
<template>
  <FormItem :field="field">
    <FieldRender :fields="processedProperties" />
  </FormItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import FieldRender from '../../field-render.vue';
  import FormItem from '../../form-item.vue';
  import type { ObjectFormSchema } from '@/components/dynamic-form/types';

  const props = defineProps<{
    field: ObjectFormSchema;
  }>();

  const processedProperties = computed(() => {
    return props.field.properties.map((property) => ({
      ...property,
      fieldName: `${props.field.fieldName}.${property.fieldName}`,
    }));
  });
</script>
