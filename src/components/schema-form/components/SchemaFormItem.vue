<template>
  <!-- 根据visible控制显隐 -->
  <template v-if="isVisible">
    <!-- 支持栅格布局 -->
    <el-row v-if="useRowCol" v-bind="computedRowProps">
      <el-col v-bind="computedColProps">
        <el-form-item
          :label="computedLabel"
          :prop="field"
          :rules="computedRules"
          :disabled="computedDisabled"
          v-bind="formItemProps"
          :class="{
            'object-form-item': schema.type === 'object',
          }"
        >
          <!-- 渲染对应组件 -->
          <component
            :is="currentComponent"
            v-model="componentValue"
            :schema="props.schema"
            v-bind="componentProps"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 不使用栅格布局 -->
    <el-form-item
      v-else
      :label="computedLabel"
      :prop="field"
      :rules="computedRules"
      :disabled="computedDisabled"
      v-bind="formItemProps"
    >
      <!-- 渲染对应组件 -->
      <component
        :is="currentComponent"
        v-model="componentValue"
        :schema="props.schema"
        v-bind="componentProps"
      />
    </el-form-item>
  </template>
</template>

<script setup lang="ts">
  import { ref, computed, inject, watch, onMounted, shallowRef } from 'vue';
  import type { Component } from 'vue';
  import type { BaseSchema, FormApi, Option } from '../types';
  import { componentMap } from './componentMap.ts';
  import { computeDynamicProp, resolveDependencies, computeLayoutProps } from '../utils';
  import { injectFormApi } from '@/components/schema-form/hooks/use-form-context.ts';
  // 组件属性
  const props = defineProps<{
    schema: BaseSchema;
    field: string;
    disabled?: boolean;
    defaultUseRowCol?: boolean;
    defaultRowProps?: any;
    defaultColProps?: any;
  }>();

  // 注入表单API
  const formApi = injectFormApi() as any;

  // 组件显隐状态
  const isVisible = computed(() => {
    return (
      computeDynamicProp({
        prop: 'visible',
        schema: props.schema,
        formApi,
        field: props.field,
      }) !== false
    );
  });

  // 是否使用栅格布局（优先使用schema配置，其次使用全局默认值）
  const useRowCol = computed(() => {
    if (props.schema.useRowCol !== undefined) {
      return props.schema.useRowCol;
    }
    return props.defaultUseRowCol;
  });

  // 计算行属性（合并全局默认和schema配置）
  const computedRowProps = computed(() => {
    const defaultProps = props.defaultRowProps || {};
    const schemaProps = computeLayoutProps(props.schema, formApi, 'rowProps');
    return { ...defaultProps, ...schemaProps };
  });

  // 计算列属性（合并全局默认和schema配置）
  const computedColProps = computed(() => {
    const defaultProps = props.defaultColProps || {};
    const schemaProps = computeLayoutProps(props.schema, formApi, 'colProps');
    return { ...defaultProps, ...schemaProps };
  });

  // 计算标签
  const computedLabel = computed(() => {
    return (
      computeDynamicProp({
        prop: 'label',
        schema: props.schema,
        formApi,
        field: props.field,
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
        field: props.field,
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
        field: props.field,
      }) || false;
    return props.disabled || schemaDisabled;
  });

  // 组件值（双向绑定）
  const componentValue = computed({
    get() {
      console.log('props.field', props.field);
      return formApi.getFieldValue(props.field);
    },
    set(value) {
      formApi.setFieldValue(props.field, value);
    },
  });

  // 当前要渲染的组件
  const currentComponent = computed<Component>(() => {
    return props.schema.component || componentMap[props.schema.type]!;
  });

  // 组件属性
  const componentProps = shallowRef<Record<string, any>>({});

  // 处理选项加载（静态/远程）
  const loadOptions = async () => {
    if (
      props.schema.type !== 'select' &&
      props.schema.type !== 'radio' &&
      props.schema.type !== 'checkbox'
    ) {
      return;
    }

    const { options, optionsDependencies = [] } = props.schema;
    if (!options) {
      componentProps.value.options = [];
      return;
    }

    // 获取依赖字段的值
    const dependentValues = resolveDependencies(optionsDependencies, formApi);

    // 加载选项（支持函数/远程请求）
    let loadedOptions: Option[] = [];
    if (typeof options === 'function') {
      const result = await options({
        formValue: formApi.getFormValue(),
        dependentValues,
      });
      loadedOptions = result as Option[];
    } else {
      loadedOptions = options as Option[];
    }

    componentProps.value.options = loadedOptions;
  };

  // 计算组件属性
  const computeComponentProps = () => {
    // 基础属性
    const baseProps: any = {
      placeholder: computeDynamicProp({
        prop: 'placeholder',
        schema: props.schema,
        formApi,
        field: props.field,
      }),
      disabled: computedDisabled.value,
    };

    // 处理选择器组件的选项
    if (['select', 'radio', 'checkbox'].includes(props.schema.type)) {
      baseProps.options = componentProps.value.options || [];
    }

    // 处理自定义组件属性（支持函数）
    const customProps =
      typeof props.schema.componentProps === 'function'
        ? props.schema.componentProps({
            formApi,
            schema: props.schema,
            field: props.field,
          })
        : props.schema.componentProps || {};

    componentProps.value = { ...baseProps, ...customProps };
  };

  // 监听依赖变化，重新加载选项和属性
  const setupWatchers = () => {
    // 监听表单值变化，重新计算动态属性
    watch(
      () => formApi.getFormValue(),
      () => {
        computeComponentProps();
      },
      { deep: true },
    );

    // 监听选项依赖变化，重新加载选项
    if (props.schema.optionsDependencies && props.schema.optionsDependencies.length) {
      props.schema.optionsDependencies.forEach((depField) => {
        watch(
          () => formApi.getFieldValue(depField),
          () => {
            loadOptions();
          },
          { deep: true },
        );
      });
    }
  };

  // 初始化
  onMounted(() => {
    // 初始加载选项
    loadOptions().then(() => {
      // 计算组件属性
      computeComponentProps();
    });

    // 设置监听器
    setupWatchers();
  });

  // 透传给el-form-item的属性
  const formItemProps = {
    ...props.schema.formItemProps,
  };
</script>
<style lang="scss" scoped>
  .object-form-item {
    :deep(.el-form-item) {
      margin-bottom: 18px;
    }
  }
</style>
