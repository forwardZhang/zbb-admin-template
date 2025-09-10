<template>
  <template v-if="isVisible">
    <el-form-item
      :label="computedLabel"
      :prop="path"
      :rules="computedRules"
      v-bind="formItemProps"
      :path="path"
    >
      <component
        :is="currentComponent"
        v-model="modelValue"
        :schema="props.schema"
        :path="path"
        v-bind="componentProps"
      />
    </el-form-item>
  </template>
</template>

<script setup lang="ts">
  import { ref, computed, inject, watch, onMounted, shallowRef } from 'vue';
  import type { Component } from 'vue';
  import type { BaseSchema, FormApi, Option } from '../types';
  import { componentMap } from './component-map.ts';
  import { computeDynamicProp, resolveDependencies, computeLayoutProps } from '../utils';
  import { injectFormApi } from '@/components/schema-form/hooks/use-form-context.ts';
  import { compact, concat } from 'lodash-es';

  // 组件属性
  const props = defineProps<{
    schema: BaseSchema;
    path?: string;
  }>();

  const path = computed(() => {
    const name = props.schema.name ?? '';
    if (props.path) {
      // 如果是数组项，已经包含索引，直接拼接
      if (props.path.includes('[')) {
        return compact([props.path, name]).join('.');
      }
      return compact([props.path, name]).join('.');
    }
    return props.schema.name;
  });

  // 注入表单API
  const formApi = injectFormApi() as any;

  // 组件显隐状态
  const isVisible = computed(() => {
    return (
      computeDynamicProp({
        prop: 'visible',
        schema: props.schema,
        formApi,
        path: path.value,
      }) !== false
    );
  });

  // 计算标签
  const computedLabel = computed(() => {
    return (
      computeDynamicProp({
        prop: 'label',
        schema: props.schema,
        formApi,
        path: path.value,
      }) || ''
    );
  });

  // 计算校验规则
  const computedRules = computed(() => {
    return (
      computeDynamicProp({
        prop: 'rules',
        schema: props.schema,
        formApi,
        path: path.value,
      }) || []
    );
  });

  // 计算禁用状态
  const computedDisabled = computed(() => {
    const schemaDisabled =
      computeDynamicProp({
        prop: 'disabled',
        schema: props.schema,
        formApi,
        path: path.value,
      }) || false;
    return schemaDisabled;
  });

  // 组件值（双向绑定）
  const modelValue = defineModel<any>();

  // 当前要渲染的组件
  const currentComponent = computed<Component>(() => {
    if (props.schema.type === 'custom') {
      return props.schema.component;
    }
    return componentMap[props.schema.type]!;
  });

  // 组件属性
  const componentProps = ref<Record<string, any>>({});

  // 计算组件属性
  const computeComponentProps = () => {
    // 基础属性
    const baseProps: any = {
      placeholder: computeDynamicProp({
        prop: 'placeholder',
        schema: props.schema,
        formApi,
        path: path.value,
      }),
      disabled: computedDisabled.value,
    };

    // 处理自定义组件属性（支持函数）
    const customProps =
      typeof props.schema.componentProps === 'function'
        ? props.schema.componentProps({
            formApi,
            schema: props.schema,
            path: path.value, // 将 field 改为 name
          })
        : props.schema.componentProps || {};

    componentProps.value = { ...baseProps, ...customProps };
  };

  // 初始化
  onMounted(() => {
    computeComponentProps();
  });

  // 透传给el-form-item的属性
  const formItemProps = {
    ...props.schema.formItemProps,
  };
</script>
<style lang="scss" scoped></style>
