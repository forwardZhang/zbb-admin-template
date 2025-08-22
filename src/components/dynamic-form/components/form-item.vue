<template>
  <el-form-item
    class="form-item"
    :label="field.label"
    :prop="field.fieldName"
    v-bind="field.formFieldProps"
    v-if="isIf"
    v-show="isShow"
    :rules="computedRules"
  >
    <slot></slot>
  </el-form-item>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { get, isFunction, isNil } from 'lodash-es';
  import { injectFormApi } from '../hooks/use-form-context.ts';
  import useDependencies from '../hooks/use-dependencies.ts';
  import type { FormSchema } from '../types';

  const formApi = injectFormApi<any>();
  const props = defineProps<{
    field: FormSchema;
  }>();

  // 依赖项处理
  const { dynamicRules, isIf, isShow } = useDependencies({
    getDependencies: () => props.field.dependencies,
    formValues: formApi.formValues,
    formApi,
    fieldName: props.field.fieldName,
  });

  // 校验规则
  const computedRules = computed(() => {
    let ruleValues: any = [];
    if (Array.isArray(props.field.rules)) {
      ruleValues = [...props.field.rules];
    } else if (!isNil(props.field.required)) {
      ruleValues.push({
        required: props.field.required,
        message: `${props.field.label}是必填项`,
        trigger: 'blur',
      });
    }
    return [...ruleValues, ...dynamicRules.value];
  });
</script>
