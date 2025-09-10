<template>
  <div class="object-field">
    <render-properties :properties="schema.properties" :parent-field="schema.field" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import type { ObjectSchema } from '../../types';
  import RenderProperties from '../RenderProperties.vue';

  const props = defineProps<{
    modelValue: Record<string, any>;
    schema: ObjectSchema;
  }>();
  console.log('schema11', props.schema);

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Record<string, any>): void;
  }>();

  // 接收子组件的更新
  const handlePropertiesChange = (value: Record<string, any>) => {
    emit('update:modelValue', value);
  };
</script>

<style scoped>
  .object-field {
    flex: 1;
  }
</style>
