<template>
  <RouterLink to="/">home</RouterLink>
  <RouterLink to="/components/form">FormPage</RouterLink>
  <RouterView />
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router';
</script>

<style scoped></style>
