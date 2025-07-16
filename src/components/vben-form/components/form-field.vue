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
      :model="formData"
    >
      <component
        :is="FieldComponent"
        :modelValue="get(formData, props.fieldName)"
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
  import { componentMap } from '@/components/vben-form/component-map.ts';
  import type { FormItemDependencies } from '@/components/vben-form/types';
  import useDependencies from '@/components/vben-form/hooks/use-dependencies.ts';

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
  const formData = defineModel<any>();
  const { dynamicComponentProps, dynamicRules, isDisabled, isIf, isRequired, isShow } =
    useDependencies({
      getDependencies: () => props.dependencies,
      formData,
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
    set(formData.value, props.fieldName, value);
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
