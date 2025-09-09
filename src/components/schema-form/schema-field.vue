<template>
  <!-- 处理嵌套对象 -->
  <div v-if="schema.type === 'object' && schema.properties" class="nested-field">
    <div class="nested-field-title">{{ schema.label }}</div>
    <div class="nested-object-content">
      <schema-field
        v-for="item in schema.properties"
        :key="item.field"
        :schema="item"
        v-model="formData"
        :prop-path="nestedPath"
      />
    </div>
  </div>

  <!-- 处理数组 -->
  <div v-else-if="schema.type === 'array' && schema.items" class="nested-array">
    <div class="nested-field-title">{{ schema.label }}</div>
    <el-button class="add-btn" size="small" @click="addArrayItem"> 添加项 </el-button>
    <div v-for="(item, index) in arrayValue" :key="index" class="array-item">
      <el-button class="remove-btn" size="small" type="danger" @click="removeArrayItem(index)">
        删除
      </el-button>
      <schema-field
        :schema="schema.items"
        v-model="arrayValue[index]"
        :prop-path="arrayPath + '[' + index + ']'"
      />
    </div>
  </div>

  <!-- 处理普通字段 -->
  <schema-form-item v-else :schema="schema" v-model="formData" :prop-path="propPath" />
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import _ from 'lodash-es';
  import SchemaFormItem from './schema-form-item.vue';

  defineOptions({
    name: 'SchemaField',
  });
  const props = withDefaults(
    defineProps<{
      schema: any;
      propPath: string;
    }>(),
    {
      propPath: '',
    },
  );
  // 计算嵌套对象的路径和值
  const nestedPath = computed(() => {
    return props.propPath && props.schema.field
      ? `${props.propPath}.${props.schema.field ?? ''}`
      : (props.schema.field ?? '');
  });

  const formData = defineModel<any>();

  const handleNestedUpdate = (value) => {
    formData.value = value;
  };

  // 计算数组的路径和值
  const arrayPath = computed(() => {
    return props.propPath && props.schema.field
      ? `${props.propPath}.${props.schema.field ?? ''}`
      : (props.schema.field ?? '');
  });

  const arrayValue = computed({
    get: () => _.get(formData.value, arrayPath.value) || [],
    set: (val) => {
      _.set(formData.value, arrayPath.value, val);
    },
  });

  const addArrayItem = () => {
    const newItem = _.cloneDeep(props.schema.items.defaultValue || {});
    arrayValue.value.push(newItem);
  };

  const removeArrayItem = (index) => {
    arrayValue.value.splice(index, 1);
  };

  const handleArrayItemUpdate = (index, value) => {
    arrayValue.value[index] = value;
  };
</script>

<style scoped>
  .nested-field,
  .nested-array {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 15px;
    background-color: #fafafa;
  }

  .nested-object-content {
    display: grid;
  }

  .nested-field-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #606266;
  }

  .array-item {
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 15px;
    position: relative;
  }

  .remove-btn {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .add-btn {
    margin-bottom: 20px;
  }
</style>
