<template>
  <el-form-item
    class="form-item"
    :label="field.label"
    :prop="field.fieldName"
    v-if="isIf"
    v-show="isShow"
    :rules="computedRules"
    v-bind="field.formFieldProps"
  >
    <slot
      :model="formValues"
      v-bind="{
        ...computedProps,
      }"
    >
      <component
        :is="FieldComponent"
        :field="field"
        :component-props="computedProps"
        v-model="modelValue"
      />
    </slot>
  </el-form-item>
</template>

<script setup lang="ts">
  import { type Component, computed } from 'vue';
  import { get, isFunction, isNil, isString, set } from 'lodash-es';
  import type { FormSchema } from '../types';
  import useDependencies from '../hooks/use-dependencies.ts';
  import { injectFormApi } from '../hooks/use-form-context.ts';
  import { getWidgetComponent } from '@/components/dynamic-form/components/widgets';

  const formApi: any = injectFormApi<any>();
  const { formValues } = formApi;

  const props = defineProps<{
    field: FormSchema;
  }>();
  defineOptions({
    name: 'FormField',
    inheritAttrs: false,
  });

  const FieldComponent = computed(() => {
    const component = props.field.type;
    const finalComponent = isString(component) ? getWidgetComponent(component as any) : component;
    if (!finalComponent) {
      console.warn(`Component ${component} is not registered`);
    }
    return finalComponent;
  });

  // 使用defineModel简化双向绑定
  const modelValue = defineModel({
    get() {
      return get(formValues, props.field.fieldName);
    },
    set(value) {
      set(formValues, props.field.fieldName, value);
    },
  });

  // 依赖项处理
  const { dynamicRules, isIf, isShow, dynamicComponentProps, isDisabled } = useDependencies({
    getDependencies: () => props.field.dependencies,
    formValues,
    formApi,
    fieldName: props.field.fieldName,
  });

  const computedProps = computed(() => {
    const componentProps = props.field.componentProps;
    const result = {
      disabled: isDisabled.value,
      placeholder: placeholderString.value,
      ...componentProps,
      ...dynamicComponentProps.value,
    };
    if (isFunction(componentProps?.onChange)) {
      result.onChange = (value) => {
        componentProps.onChange?.({ value, formValues, formApi });
      };
    }
    return result;
  });

  const placeholderString = computed(() => {
    if (isString(props.field.type) && isString(props.field.label)) {
      return props.field.type === 'select'
        ? `请选择${props.field.label}`
        : `请输入${props.field.label}`;
    }
    return '';
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
