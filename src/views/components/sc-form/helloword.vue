<template>
  <div class="container">heoo</div>
</template>

<script setup lang="ts">
  import { injectFormApi } from '@/components/schema-form/hooks/use-form-context.ts';
  import { onMounted } from 'vue';

  const api = injectFormApi() as any;
  onMounted(() => {
    console.log('api', api);
  });
</script>

<style scoped lang="scss"></style>
