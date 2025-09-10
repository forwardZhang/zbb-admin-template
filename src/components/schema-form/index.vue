<template>
  <el-form
    ref="formRef"
    :model="modelValue"
    :label-width="props.labelWidth"
    v-bind="formProps"
    @submit.prevent="handleSubmit"
  >
    <SchemaFormItem
      v-for="(schemaItem, index) in props.schemas"
      :key="`${schemaItem.field}-${index}`"
      :schema="schemaItem"
      :field="schemaItem.field"
      :disabled="props.disabled"
      :default-use-row-col="defaultUseRowCol"
      :default-row-props="defaultRowProps"
      :default-col-props="defaultColProps"
    />
  </el-form>
</template>

<script setup lang="ts">
  import { ref, provide, onMounted, useAttrs, watchEffect } from 'vue';
  import { ElForm } from 'element-plus';
  import SchemaFormItem from './components/SchemaFormItem.vue';
  import type { SchemaFormProps, SchemaFormEmits } from './types';
  import { useFormApi } from './hooks/useFormApi';
  import { setValue } from './utils';
  import { validateDependencies } from './utils/detectCircularDependencies';
  import { provideFormApi } from './hooks/use-form-context.ts';
  // 组件属性
  const props = defineProps<SchemaFormProps>();
  const emit = defineEmits<SchemaFormEmits>();
  const attrs = useAttrs();
  console.log('schemas', props.schemas);

  // Vue3.5+ 双向绑定简化
  const modelValue = defineModel<Record<string, any>>({
    default: () => ({}),
  });

  // 表单引用
  const formRef = ref<InstanceType<typeof ElForm>>();

  // 初始化表单API
  const formApi = useFormApi(modelValue, formRef, emit);

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
  onMounted(() => {
    // 初始化时检测循环依赖
    if (props.schemas && props.schemas.length > 0) {
      validateDependencies(props.schemas);
    }
  });

  // 暴露组件方法
  defineExpose({
    ...formApi,
  });
</script>
