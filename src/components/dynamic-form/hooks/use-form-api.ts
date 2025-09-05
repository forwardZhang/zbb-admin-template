import { ref, reactive, shallowReactive, type Ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { get, merge, set } from 'lodash-es';

// 生成类型

export function useFormApi() {
  const componentInstanceMap = shallowReactive({});

  const formValues = reactive({});
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

  function getValues() {
    return formValues;
  }

  function setValues(data = {}) {
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
    set(componentInstanceMap, fieldName, instance);
  }
  function getComponentInstance(fieldName: string) {
    get(componentInstanceMap, fieldName);
  }

  function registerForm({
    formRef,
    initFormValue = {},
  }: {
    formRef: Ref<FormInstance | null>;
    initFormValue?: any;
  }) {
    formInstanceRef.value = formRef.value;
    setValues(initFormValue);
  }

  return {
    formValues,
    validate,
    validateField,
    resetFields,
    clearValidate,
    registerForm,
    getOptions,
    setOptions,
    setComponentInstance,
    getComponentInstance,
  };
}
