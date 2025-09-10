import type { Ref } from 'vue';
import { ElForm } from 'element-plus';
import { getValue, setValue } from '../utils';
import type { FormApi } from '../types';

/**
 * 表单API Hook
 * @param modelValue 表单数据（通过defineModel获取）
 * @param formRef 表单组件引用
 * @param emit 组件emit函数
 * @returns 表单操作API
 */
export function useFormApi(
  modelValue: Ref<Record<string, any>>,
  formRef: Ref<InstanceType<typeof ElForm> | undefined>,
): FormApi {
  // 获取完整表单值
  const getFormValue = () => {
    return { ...modelValue.value };
  };

  // 设置完整表单值
  const setFormValue = (value: Record<string, any>, emitChange = true) => {
    if (emitChange) {
      modelValue.value = { ...value };
    } else {
      Object.assign(modelValue.value, value);
    }
  };

  // 获取单个字段值
  const getFieldValue = (field: string) => {
    return getValue(modelValue.value, field);
  };

  // 设置单个字段值
  const setFieldValue = (field: string, value: any, emitChange = true) => {
    setValue(modelValue.value, field, value);
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
