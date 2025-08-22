<template>
  <FormItem :field="field">
    <slot
      :model="formValues"
      v-bind="{
        ...computedProps,
      }"
    >
      <component
        :is="FieldComponent"
        v-model="fieldValue"
        v-bind="{
          ...computedProps,
        }"
      />
    </slot>
  </FormItem>
</template>

<script setup lang="ts">
  import { type Component, computed } from 'vue';
  import { get, isFunction, isString, set } from 'lodash-es';
  import type { FormSchema } from '../../../types';
  import useDependencies from '../../../hooks/use-dependencies.ts';
  import { injectFormApi } from '../../../hooks/use-form-context.ts';
  import { getWidgetComponent } from '@/components/dynamic-form/components/widgets';
  import FormItem from '../../form-item.vue';

  const formApi: any = injectFormApi<any>();
  const { formValues } = formApi;

  const props = defineProps<{
    field: FormSchema;
  }>();

  const FieldComponent = computed(() => {
    const component = props.field.type;
    const finalComponent = isString(component) ? getWidgetComponent(component as any) : component;
    if (!finalComponent) {
      console.warn(`Component ${component} is not registered`);
    }
    return finalComponent;
  });

  // 使用defineModel简化双向绑定
  const fieldValue = defineModel({
    get() {
      return get(formValues, props.field.fieldName);
    },
    set(value) {
      set(formValues, props.field.fieldName, value);
    },
  });

  // 依赖项处理
  const { dynamicComponentProps, isDisabled } = useDependencies({
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
</script>
