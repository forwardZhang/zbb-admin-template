import { reactive, provide, inject } from 'vue';
import { ElMessage } from 'element-plus';
import _ from 'lodash-es';

// 提供表单上下文
export const SchemaFormContext = Symbol('SchemaFormContext');

export function useSchemaForm() {
  const formContext = inject(SchemaFormContext);

  if (!formContext) {
    throw new Error('useSchemaForm must be used within SchemaForm');
  }

  return formContext;
}

export function useSchemaFormProvider(formRef, formData) {
  const formContext = {
    // 获取表单值
    getFormData: () => formData,

    // 设置表单值
    setFormData: (data) => {
      Object.assign(formData, data);
    },

    // 设置字段值
    setFieldValue: (field, value) => {
      _.set(formData, field, value);
    },

    // 获取字段值
    getFieldValue: (field) => {
      return _.get(formData, field);
    },

    // 触发字段更新（用于依赖更新）
    triggerFieldUpdate: (field) => {
      // 这里可以添加特定字段更新逻辑
    },

    // 验证表单
    validate: () => {
      return new Promise((resolve, reject) => {
        if (formRef.value) {
          formRef.value.validate((valid) => {
            if (valid) {
              resolve(true);
            } else {
              reject(new Error('验证失败'));
            }
          });
        } else {
          reject(new Error('表单实例未找到'));
        }
      });
    },

    // 重置表单
    resetFields: () => {
      if (formRef.value) {
        formRef.value.resetFields();
      }
    },
  };

  // 提供上下文给后代组件
  provide(SchemaFormContext, formContext);

  return formContext;
}
