<template>
  <div class="schema-form-container">
    {{ formData }}
    <el-form ref="formRef" :model="formData" :label-width="labelWidth">
      <template v-for="item in schemas" :key="item.field">
        <schema-field :schema="item" v-model="formData" prop-path="" />
      </template>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch, ref, provide } from 'vue';
  import SchemaField from './schema-field.vue';
  import { useSchemaFormProvider } from './hooks/use-schema-form.ts';
  import { cloneDeep } from 'lodash-es';
  defineOptions({
    name: 'SchemaForm',
  });
  const props = defineProps<{
    schemas: any;
    labelWidth: string;
    modelValue: any;
  }>();
  // const formData = reactive(cloneDeep(props.modelValue));
  const formData = defineModel<any>();
  const formRef = ref();
  const formContext = useSchemaFormProvider(formRef, formData);
  provide('formContext', formContext);
  // watch(
  //   formData,
  //   (newValue) => {
  //     baseFormData.value = newValue;
  //   },
  //   { deep: true },
  // );
</script>

<style scoped>
  .schema-form-container {
    padding: 20px;
  }
</style>
