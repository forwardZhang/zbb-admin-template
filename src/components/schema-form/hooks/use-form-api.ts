import { ref, reactive, shallowReactive, type Ref, useTemplateRef } from 'vue';
import type { FormInstance } from 'element-plus';
import { cloneDeep, get, merge, set, uniqueId } from 'lodash-es';
import useFormOptions from '@/components/schema-form/hooks/use-form-options.ts';
import useFieldInstance from '@/components/schema-form/hooks/use-field-instance.ts';

// 生成类型

export function useFormApi() {
  const formId = uniqueId('form-');
  const formData = reactive({});
  const formRef = useTemplateRef<FormInstance>('formRef');
  const validate = (...args) => {
    return formRef.value?.validate(...args);
  };
  const validateField = (...args) => {
    return formRef.value?.validateField(...args);
  };
  const resetFields = (...args) => {
    formRef.value?.resetFields(...args);
  };
  const clearValidate = (...args) => {
    formRef.value?.clearValidate(...args);
  };

  function getFormData() {
    return formData;
  }

  function setFormData(data = {}) {
    merge(formData, data);
  }

  const { getOptions, setOptions } = useFormOptions();
  const { getFieldInstance, setFieldInstance } = useFieldInstance();
  function registerForm({ initFormValue = {} }: { initFormValue?: any }) {
    setFormData(cloneDeep(initFormValue));
  }

  return {
    formRef,
    formId,
    formData,
    validate,
    validateField,
    resetFields,
    clearValidate,
    registerForm,
    getOptions,
    setOptions,
    setFieldInstance,
    getFieldInstance,
    getFormData,
    setFormData,
  };
}
