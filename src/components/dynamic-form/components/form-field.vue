<template>
  <el-form-item
    class="form-item"
    :label="props.label"
    :prop="props.fieldName"
    v-bind="props.formFieldProps"
    v-if="isIf"
    v-show="isShow"
  >
    <slot
      v-bind="{
        ...computedProps,
      }"
      :model="formValues"
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
  import { get, isFunction, isString, set } from 'lodash-es';
  import { componentMap } from '../component-map.ts';
  import type { FormItemDependencies } from '../types';
  import useDependencies from '../hooks/use-dependencies.ts';
  import { injectFormApi } from '../hooks/use-form-context.ts';
  const itemId = useId();
  const attrs = useAttrs();
  const props = defineProps<{
    fieldName: string;
    label: string;
    rules?: any[];
    commonComponentProps?: any;
    componentProps?: any;
    formFieldProps?: any;
    formItemClass?: any;
    dependencies?: FormItemDependencies;
    component: string | Component | (() => Component | string) | null;
  }>();
  const formApi: any = injectFormApi<any>();
  const { formValues } = formApi;
  const { dynamicComponentProps, dynamicRules, isDisabled, isIf, isRequired, isShow } =
    useDependencies({
      getDependencies: () => props.dependencies,
      formValues,
      formApi,
    });
  const FieldComponent = computed(() => {
    const component = props.component;
    const finalComponent = isString(component) ? componentMap[component] : component;
    if (!finalComponent) {
      // 组件未注册
      console.warn(`Component ${component} is not registered`);
    }
    return finalComponent;
  });

  function updateModelValue(value: any) {
    set(formValues, props.fieldName, value);
  }
  const computedProps = computed(() => {
    const componentProps = props.componentProps ?? {};
    return {
      disabled: isDisabled.value,
      ...componentProps,
    };
  });
</script>

<style scoped lang="scss"></style>
