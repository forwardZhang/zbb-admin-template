<template>
  <el-form-item
    :prop="path"
    v-if="visible"
    :path="path"
    :rules="computedRules"
    v-bind="formItemProps"
  >
    <template #label>
      <!--      todo formData 传递不过去 warning-->
      <RenderContent :content="schema.label" :data="formData"></RenderContent>
    </template>
    <component
      v-if="currentComponent"
      :is="currentComponent"
      v-model="modelValue"
      :schema="props.schema"
      :path="path"
      :component-props="computedProps"
    />
    <!--    todo 自定义插槽-->
    <template v-if="schema.type === 'slot'">
      <SlotContent />
    </template>
  </el-form-item>
</template>

<script setup lang="ts">
  import { ref, computed, useSlots } from 'vue';
  import type { Component } from 'vue';
  import { componentMap } from './component-map.ts';
  import { compact, concat, isFunction, isNil } from 'lodash-es';
  import { injectFormApi, injectSlotCtx } from '@/components/schema-form/hooks/use-form-context.ts';
  import useDependencies from '@/components/schema-form/hooks/use-dependencies.ts';
  import type { BaseSchema, FormApi } from '@/components/types/Form.ts';
  import RenderContent from '../../render-content/render-content.vue';

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
  const slotCtx = injectSlotCtx() as any;

  const formData = computed(() => {
    return formApi?.getFormData?.() ?? {};
  });
  // 组件值（双向绑定）
  const modelValue = defineModel<any>();

  const slots = useSlots();
  const SlotContent = () => {
    if (slots.default) {
      return slots.default({
        path: path.value,
        schema: props.schema,
      });
    }
    if (slotCtx?.[props.schema.slotName]) {
      return slotCtx?.[props.schema.slotName]({
        path: path.value,
        schema: props.schema,
      });
    }
    return undefined;
  };

  // 当前要渲染的组件
  const currentComponent = computed<Component | null>(() => {
    if (props.schema.type === 'slot') {
      return null;
    }
    if (props.schema.type === 'custom') {
      return props.schema.component!;
    }
    return componentMap[props.schema.type]!;
  });

  // 组件属性
  const { dynamicRules, visible, dynamicComponentProps, dynamicFormItemProps, isDisabled } =
    useDependencies({
      getDependencies: () => props.schema.dependencies,
      formData: formApi.getFormData(),
      formApi,
      path: path.value,
    });

  const formItemProps = computed(() => {
    return {
      ...props.schema.formItemProps,
      ...dynamicFormItemProps.value,
    };
  });
  const computedProps = computed(() => {
    const componentProps = props.schema.componentProps;
    const result = {
      ...componentProps,
      ...dynamicComponentProps.value,
    };
    return result;
  });

  // 校验规则
  const computedRules = computed(() => {
    let ruleValues: any = [];
    const schema = props.schema;
    if (Array.isArray(schema.rules)) {
      ruleValues = [...schema.rules];
    } else if (!isNil(schema.required)) {
      ruleValues.push({
        required: schema.required,
        message: `${schema.label}是必填项`,
        trigger: 'blur',
      });
    }
    return [...ruleValues, ...dynamicRules.value];
  });
</script>
<style lang="scss" scoped></style>
