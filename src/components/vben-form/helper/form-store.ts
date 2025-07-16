import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useFormStore = defineStore('v-ben-form', () => {
  const formData = ref({});

  return {
    formData,
  };
});
