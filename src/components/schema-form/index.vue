<template>
  <el-form
    ref="formRef"
    :model="formData"
    :label-width="props.labelWidth"
    v-bind="formProps"
    @submit.prevent="handleSubmit"
  >
    <div class="form-content">
      <SchemaFormItem :schema="currentSchema" path="" v-model="formData" />
    </div>
  </el-form>
</template>

<script setup lang="ts">
  import { onMounted, useSlots, watch } from 'vue';
  import { ElForm } from 'element-plus';
  import { useFormApi } from './hooks/use-form-api.ts';
  import { provideFormApi, provideSlotCtx } from './hooks/use-form-context.ts';
  import SchemaFormItem from '@/components/schema-form/components/schema-form-item.vue';
  import type { SchemaFormEmits, SchemaFormProps } from '@/components/types/Form.ts';
  // 组件属性
  const props = defineProps<SchemaFormProps>();
  const emits = defineEmits<SchemaFormEmits>();
  // 初始化表单API
  const formApi: any = useFormApi();
  const { registerForm, formRef, formData, formId } = formApi;
  // 提供表单API给后代组件
  provideFormApi(formApi);

  // 插槽提供给后代组件
  const slots = useSlots();
  provideSlotCtx(slots);

  // 处理表单提交
  const handleSubmit = async () => {
    const isValid = await formApi.validate();
    if (isValid) {
      emits('submit', formApi.getFormData());
    }
  };
  // 初始化默认值
  onMounted(() => {});

  const currentSchema = {
    type: 'object',
    label: '',
    name: '',
    fields: props.schemas,
    inline: props.inline,
  };

  registerForm({
    formRef,
    initFormValue: props.modelValue,
  });

  watch(
    () => formData,
    (newValue) => {
      emits('update:modelValue', newValue);
    },
    {
      deep: true,
    },
  );
  // 暴露组件方法
  defineExpose({
    ...formApi,
  });
</script>
<style lang="scss" scoped>
  .form-content {
    :deep(.el-form-item) {
      margin-bottom: 18px;
    }
  }
</style>
