<template>
  <div class="array-field">
    <div
      v-for="(item, index) in modelValue"
      :key="schema.rowKey ? item[schema.rowKey] : index"
      class="array-item"
    >
      <div class="array-item__content">
        <SchemaFormItem
          :schema="schema.item as any"
          :path="`${path}[${index}]`"
          v-model="modelValue[index]"
        />
      </div>
      <div class="array-item__actions">
        <el-button
          size="small"
          text
          @click="removeItem(index)"
          :disabled="modelValue.length <= (schema.minLength || 0)"
        >
          {{ schema.removeText || '删除' }}
        </el-button>
      </div>
    </div>

    <el-button
      type="primary"
      size="small"
      @click="addItem"
      :disabled="modelValue.length >= (schema.maxLength || 5)"
      class="array-add-btn"
    >
      {{ schema.addText || '添加' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
  import { isFunction } from 'lodash-es';
  import SchemaFormItem from '@/components/schema-form/components/schema-form-item.vue';
  import { injectFormApi } from '@/components/schema-form/hooks/use-form-context.ts';
  import type { ArraySchema, FormApi, Schema } from '@/components/types/Form.ts';
  defineOptions({
    name: 'ArrayField',
    inheritAttrs: false,
  });
  const props = defineProps<{
    schema: ArraySchema;
    path: string;
  }>();

  const formApi = injectFormApi();

  const modelValue = defineModel<any[]>({
    default: () => [],
  });

  // 添加新项
  const addItem = () => {
    // 创建新项（基于默认值）
    const newItem = createDefaultItem();
    modelValue.value.push(newItem);
  };

  // 移除项
  const removeItem = (index: number) => {
    modelValue.value.splice(index, 1);
  };

  // 创建带默认值的新项
  const createDefaultItem = () => {
    if (isFunction(props.schema.getDefaultItem)) {
      return props.schema.getDefaultItem();
    }
    return {};
  };
</script>

<style scoped>
  .array-field {
    padding: 8px 0;
    flex: 1;
    margin-bottom: -18px;
  }

  .array-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    padding: 8px;
    border: 1px solid #eee;
    border-radius: 4px;
  }

  .array-item__content {
    flex: 1;
  }

  .array-item__actions {
    margin-left: 16px;
  }

  .array-add-btn {
    margin-top: 8px;
  }
</style>
