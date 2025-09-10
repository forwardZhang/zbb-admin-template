<template>
  <el-descriptions title="页面跳转" :column="1" border>
    <el-descriptions-item label="home页面">
      <RouterLink to="/">goToHome</RouterLink>
    </el-descriptions-item>
    <el-descriptions-item label="schemaForm">
      <RouterLink to="/components/schema-form">goToSchemaForm</RouterLink>
    </el-descriptions-item>
  </el-descriptions>
  <div class="page-wrap">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router';
</script>

<style scoped lang="scss">
  .page-wrap {
    padding: 40px;
    border: 1px solid #ccc;
    max-width: 900px;
    margin: 0 auto;
    margin-top: 40px;
    border-radius: 10px;
  }
</style>
