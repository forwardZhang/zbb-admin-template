<template>
  <div>select</div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const props = defineProps<{
    componentProps?: any;
  }>();
  const modelValue = defineModel<string>({
    default: undefined,
    set(value) {
      return value;
    },
  });
  const sourceOptions = ref([]);
</script>

<style scoped lang="scss"></style>
