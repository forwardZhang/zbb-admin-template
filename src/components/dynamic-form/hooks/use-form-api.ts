import { ref, reactive, shallowReactive, type Ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { get, merge, set } from 'lodash-es';

// 生成类型

export function useFormApi() {
  const formValues = reactive({});
  const prevFormData = reactive({});
  const componentInstanceMap = shallowReactive({});

  const formInstanceRef = ref<FormInstance | null>();
  const validate = (...args) => {
    return formInstanceRef.value?.validate(...args);
  };
  const validateField = (...args) => {
    return formInstanceRef.value?.validateField(...args);
  };
  const resetFields = (...args) => {
    formInstanceRef.value?.resetFields(...args);
  };
  const clearValidate = (...args) => {
    formInstanceRef.value?.clearValidate(...args);
  };

  function getFormValues() {
    return formValues;
  }

  function setFormValues(data = {}) {
    merge(formValues, data);
  }

  const optionsMap = shallowReactive({});

  function getOptions({ fieldName }) {
    return get(optionsMap, fieldName);
  }

  function setOptions({ fieldName, options = [] }) {
    set(optionsMap, fieldName, options ?? []);
  }

  function setComponentInstance(fieldName: string, instance: any) {
    componentInstanceMap[fieldName] = instance;
  }

  function registerForm({
    formRef,
    formValues,
  }: {
    formRef: Ref<FormInstance | null>;
    formValues: Record<string, any>;
  }) {
    formInstanceRef.value = formRef.value;
    setFormValues(formValues);
  }

  return {
    formValues,
    validate,
    validateField,
    resetFields,
    clearValidate,
    getFormValues,
    setFormValues,
    registerForm,
    getOptions,
    setOptions,
    setComponentInstance,
  };
}
