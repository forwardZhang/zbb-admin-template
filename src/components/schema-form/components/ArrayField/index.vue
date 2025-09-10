<template>
  <div class="array-field">
    <div v-for="(item, index) in modelValue" :key="index" class="array-item">
      <div class="array-item__content">
        <component
          :is="itemComponent"
          v-model="modelValue[index]"
          :schema="schema.items"
          :field="`${field}[${index}]`"
        />
      </div>
      <div class="array-item__actions">
        <el-button
          type="text"
          size="small"
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
      :disabled="modelValue.length >= (schema.maxLength || Infinity)"
      class="array-add-btn"
    >
      {{ schema.addText || '添加' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, inject } from 'vue';
  import type { ArraySchema, Schema, FormApi } from '../../types';
  import { componentMap } from '../componentMap';
  import { injectFormApi } from '@/components/schema-form/hooks/use-form-context.ts';

  const props = defineProps<{
    schema: ArraySchema;
    field: string;
  }>();

  const formApi = injectFormApi();

  // 获取数组项对应的组件
  const itemComponent = computed(() => {
    return props.schema.items.component || componentMap[props.schema.items.type]!;
  });

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
    const defaultItem: any = {};

    // 处理对象类型的数组项
    if (props.schema.items.type === 'object' && 'properties' in props.schema.items) {
      props.schema.items.properties.forEach((prop) => {
        if (prop.defaultValue !== undefined) {
          defaultItem[prop.field] = prop.defaultValue;
        }
      });
    } else {
      // 基础类型的默认值
      return props.schema.items.defaultValue !== undefined ? props.schema.items.defaultValue : null;
    }

    return defaultItem;
  };
</script>

<style scoped>
  .array-field {
    padding: 8px 0;
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
