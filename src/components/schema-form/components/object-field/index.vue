<template>
  <div class="object-field">
    <ObjectRender :schema="schema" :path="path" v-model="modelValue" />
  </div>
</template>

<script setup lang="ts">
  import type { ObjectSchema } from '../../types';
  import ObjectRender from './object-render.vue';
  defineOptions({
    name: 'ObjectField',
    inheritAttrs: false,
  });
  const props = defineProps<{
    schema: ObjectSchema;
    path: string;
  }>();
  const modelValue = defineModel<any>({ default: () => ({}) });
</script>

<style scoped lang="scss">
  .object-field {
    flex: 1;
    margin-bottom: -18px;
  }
</style>
