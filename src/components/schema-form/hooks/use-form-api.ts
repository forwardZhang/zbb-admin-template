import { type Ref, unref } from 'vue';
import { ElForm } from 'element-plus';
import type { FormApi } from '../types';
import { get, set } from 'lodash-es';

/**
 * 表单API Hook
 * @param modelValue 表单数据（通过defineModel获取）
 * @param formRef 表单组件引用
 * @returns 表单操作API
 */
export function useFormApi(
  modelValue: Ref<Record<string, any>>,
  formRef: Ref<InstanceType<typeof ElForm> | undefined>,
): FormApi {
  // 获取完整表单值
  const getFormValue = () => {
    return unref(modelValue);
  };

  // 设置完整表单值
  const setFormValue = (value: Record<string, any>) => {
    Object.assign(modelValue.value, value);
  };

  // 获取单个字段值
  const getFieldValue = (path: string) => {
    return get(modelValue.value, path);
  };

  // 设置单个字段值
  const setFieldValue = (path: string, value: any) => {
    set(modelValue.value, path, value);
  };

  // 验证整个表单
  const validate = async () => {
    if (formRef.value) {
      try {
        await formRef.value.validate();
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  // 验证单个字段
  const validateField = async (field: string) => {
    if (formRef.value) {
      await formRef.value.validateField(field);
    }
  };

  // 重置表单
  const resetFields = () => {
    if (formRef.value) {
      formRef.value.resetFields();
    }
  };

  // 获取表单组件引用
  const getFormRef = () => {
    return formRef.value;
  };

  return {
    getFormValue,
    setFormValue,
    getFieldValue,
    setFieldValue,
    validate,
    validateField,
    resetFields,
    getFormRef,
  };
}
