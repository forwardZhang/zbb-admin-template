<template>
  <div class="container">
    我是slot渲染的内容
    <input type="text" v-model="content" />
  </div>
</template>

<script setup lang="ts">
  import { injectFormApi } from '@/components/schema-form/hooks/use-form-context.ts';

  const content = defineModel<any>();
  console.log('Math', Math.random());
  const formApi = injectFormApi();
  console.log('formApi', formApi);

  setTimeout(() => {
    formApi?.setFormData({
      slot1: '2222222222',
    });
  }, 2000);
</script>

<style scoped lang="scss"></style>
