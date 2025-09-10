<template>
  <el-form
    ref="formRef"
    :model="modelValue"
    :label-width="props.labelWidth"
    v-bind="formProps"
    @submit.prevent="handleSubmit"
  >
    <div class="form-content">
      <render-field :schema="currentSchema" path="" v-model="modelValue" />
    </div>
  </el-form>
</template>

<script setup lang="ts">
  import { ref, provide, onMounted, useAttrs, watchEffect } from 'vue';
  import { ElForm } from 'element-plus';
  import type { SchemaFormProps, SchemaFormEmits } from './types';
  import { useFormApi } from './hooks/use-form-api.ts';
  import { provideFormApi } from './hooks/use-form-context.ts';
  import RenderField from '@/components/schema-form/components/render-field.vue';
  // 组件属性
  const props = defineProps<SchemaFormProps>();
  const emit = defineEmits<SchemaFormEmits>();
  const attrs = useAttrs();

  // Vue3.5+ 双向绑定简化
  const modelValue = defineModel<Record<string, any>>({
    default: () => ({}),
  });

  // 表单引用
  const formRef = ref<InstanceType<typeof ElForm>>();

  // 初始化表单API
  const formApi = useFormApi(modelValue, formRef);

  // 提供表单API给后代组件
  provideFormApi(formApi);

  // 透传给el-form的属性
  const formProps = { ...attrs };

  // 处理表单提交
  const handleSubmit = async () => {
    const isValid = await formApi.validate();
    if (isValid) {
      emit('submit', formApi.getFormValue());
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
