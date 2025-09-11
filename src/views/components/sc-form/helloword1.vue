<template>
  <div class="container">heoo 1111</div>
</template>

<script setup lang="ts">
  import { injectFormApi } from '@/components/schema-form/hooks/use-form-context.ts';
  import { onMounted } from 'vue';

  const api = injectFormApi() as any;
  onMounted(() => {
    console.log('api', api?.getValues());
  });
</script>

<style scoped lang="scss"></style>
