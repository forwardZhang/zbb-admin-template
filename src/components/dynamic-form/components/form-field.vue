<template>
  <el-form-item
    class="form-item"
    :label="props.label"
    :prop="props.fieldName"
    v-bind="props.formFieldProps"
    v-if="isIf"
    v-show="isShow"
    :rules="computedRules"
  >
    <slot
      :model="formValues"
      v-bind="{
        ...computedProps,
      }"
    >
      <component
        :is="FieldComponent"
        :modelValue="get(formValues, props.fieldName)"
        @update:modelValue="updateModelValue"
        v-bind="{
          ...computedProps,
        }"
      />
    </slot>
  </el-form-item>
</template>

<script setup lang="ts">
  import { type Component, computed, useAttrs, useId } from 'vue';
  import { get, isFunction, isNil, isString, set } from 'lodash-es';
  import type { FormItemDependencies } from '../types';
  import useDependencies from '../hooks/use-dependencies.ts';
  import { injectFormApi } from '../hooks/use-form-context.ts';
  import { getWidgetComponent } from '@/components/dynamic-form/components/widgets';
  const itemId = useId();
  const attrs = useAttrs();
  const props = withDefaults(
    defineProps<{
      label: string;
      fieldName: string;
      type: string | Component | (() => Component | string) | null;
      formFieldProps?: any;
      componentProps?: any;
      dependencies?: FormItemDependencies;
      required?: boolean | undefined;
      rules?: any[];
    }>(),
    {
      required: undefined,
      componentProps: () => ({}),
      formFieldProps: () => ({}),
    },
  );
  const formApi: any = injectFormApi<any>();
  const { formValues } = formApi;

  const FieldComponent = computed(() => {
    const component = props.type;
    console.log('component', component);
    const finalComponent = isString(component) ? getWidgetComponent(component as any) : component;
    if (!finalComponent) {
      // 组件未注册
      console.warn(`Component ${component} is not registered`);
    }
    return finalComponent;
  });

  function updateModelValue(value: any) {
    set(formValues, props.fieldName, value);
  }

  // 依赖项，字段发生变化,则重新计算
  const { dynamicComponentProps, dynamicRules, isDisabled, isIf, isShow } = useDependencies({
    getDependencies: () => props.dependencies,
    formValues,
    formApi,
    fieldName: props.fieldName,
  });

  const computedProps = computed(() => {
    const componentProps = props.componentProps;
    const result = {
      disabled: isDisabled.value,
      placeholder: placeholderString.value,
      ...componentProps,
      ...dynamicComponentProps.value,
    };
    if (isFunction(componentProps.onChange)) {
      result.onChange = (value) => {
        componentProps.onChange?.({ value, formValues, formApi });
      };
    }
    return result;
  });

  const placeholderString = computed(() => {
    if (isString(props.type) && isString(props.label)) {
      return props.type === 'select' ? `请选择${props.label}` : `请输入${props.label}`;
    }
    return '';
  });

  // 校验规则
  const computedRules = computed(() => {
    let ruleValues: any = [];
    if (Array.isArray(props.rules)) {
      ruleValues = [...props.rules];
    } else if (!isNil(props.required)) {
      ruleValues.push({
        required: props.required,
        message: `${props.label}是必填项`,
        trigger: 'blur',
      });
    }
    return [...ruleValues, ...dynamicRules.value];
  });
</script>

<style scoped lang="scss"></style>
