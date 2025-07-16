<template>
  <el-form :model="formData" :rules="rules" label-position="left" ref="formRef">
    <FormLayout :schema="schema">
      <template #item="{ field }: Record<string, any>">
        <FormItem :field="field" v-model="formData">
          <!-- 动态传递插槽 -->
          <template v-if="field.slotName" #[field.slotName]="scope">
            <slot :name="field.slotName" v-bind="scope" />
          </template>
        </FormItem>
      </template>
    </FormLayout>
  </el-form>
</template>

<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { type FormInstance, type FormRules } from 'element-plus';

  defineOptions({
    name: 'SchemaForm',
    inheritAttrs: false,
  });
  import FormLayout from './components/form-layout/index.vue';
  import FormItem from './components/form-item/index.vue';

  const props = withDefaults(
    defineProps<{
      schema: any[];
      rules?: FormRules;
      formProps?: any;
    }>(),
    {
      rules: () => ({}),
      formProps: () => ({}),
    },
  );
  const formRef = useTemplateRef<FormInstance>('formRef');
  const formData = defineModel<any>({
    default: () => ({}),
  });

  function validate() {
    return formRef.value?.validate();
  }

  defineExpose({
    validate,
  });
</script>

<style scoped lang="scss"></style>
