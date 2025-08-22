<template>
  <BaseField v-if="!isNestedType" :field="field" />
  <ObjectField v-else-if="field.type === 'object'" :field="field" />
  <ArrayField v-else-if="field.type === 'array'" :field="field" />
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import BaseField from '@/components/dynamic-form/components/widgets/base-field/index.vue';
  import ObjectField from '../components/widgets/object-field/index.vue';
  import ArrayField from '../components/widgets/array-field/index.vue';
  const props = defineProps<{
    field: any;
  }>();

  const isNestedType = computed(() => {
    return props.field.type === 'object' || props.field.type === 'array';
  });
</script>
