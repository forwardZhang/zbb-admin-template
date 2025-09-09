<template>
  <el-form-item
    v-if="shouldShow"
    :prop="fieldPath"
    :label="getDynamicProps('label')"
    :rules="getDynamicProps('rules')"
  >
    <!-- 处理select组件 -->
    <el-select
      v-if="schema.component === 'el-select'"
      v-model="modelValue"
      v-bind="schema.componentProps || {}"
      :placeholder="getDynamicProps('placeholder')"
      :loading="loading"
      :clearable="schema.clearable !== false"
      :filterable="schema.filterable || false"
    >
      <el-option
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled || false"
      />
    </el-select>
    <component
      v-else-if="schema.component"
      :is="schema.component"
      v-model="modelValue"
      v-bind="schema.componentProps || {}"
      :placeholder="getDynamicProps('placeholder')"
      :loading="loading"
      :options="options"
    />
    <span v-else>未定义组件类型: {{ schema.type }}</span>
  </el-form-item>
</template>

<script lang="ts" setup>
  import { useSchemaField } from './hooks/use-schema-field.ts';
  import { computed } from 'vue';
  import { get, set } from 'lodash-es';
  defineOptions({
    name: 'SchemaFormItem',
  });
  const props = defineProps<{
    schema: any;
    propPath: string;
  }>();
  // 计算当前字段的值
  const formData = defineModel<any>();
  const { shouldShow, getDynamicProps, options, loading, fieldPath } = useSchemaField({
    schema: props.schema,
    propPath: props.propPath,
    formData: formData.value,
  });

  const modelValue = computed({
    get() {
      return get(formData.value, fieldPath.value);
    },
    set(value) {
      set(formData.value, fieldPath.value, value);
    },
  });
</script>
