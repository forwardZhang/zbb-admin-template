<template>
  <div class="dynamic-form" v-if="isMounted">
    <el-form
      ref="formRef"
      :inline="isInline"
      :model="formValues"
      label-position="right"
      class="el-form-instance"
    >
      <el-row :gutter="16" v-if="!isInline">
        <el-col :span="24" v-for="field in computedFields" :key="field.fieldName">
          <FormField :field="field">
            <template #default="slotData">
              <slot :name="field.fieldName" v-bind="slotData"></slot>
            </template>
          </FormField>
        </el-col>
      </el-row>
      <template v-else v-for="field in computedFields" :key="field.fieldName">
        <FormField :field="field">
          <template #default="slotData">
            <slot :name="field.fieldName" v-bind="slotData"></slot>
          </template>
        </FormField>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, useId, useSlots, useTemplateRef, watch } from 'vue';
  import { useFormApi } from './hooks/use-form-api.ts';
  import type { FormInstance } from 'element-plus';
  import { provideFormApi } from './hooks/use-form-context';
  import FormField from './components/form-field.vue';
  const props = withDefaults(
    defineProps<{
      inline?: boolean;
      fields: any[];
      modelValue: any;
    }>(),
    {
      inline: false,
    },
  );

  const isInline = computed(() => props.inline);
  const isMounted = ref(false);
  const formRef = useTemplateRef<FormInstance>('formRef');
  const formApi = useFormApi();
  const { registerForm, formValues } = formApi;
  provideFormApi(formApi);

  const computedFields = computed(() => {
    return (props.fields || []).map((field, index) => {
      return {
        ...field,
        componentProps: field.componentProps,
        formFieldProps: {
          // ...formFieldProps,
          ...field.formFieldProps,
        },
      };
    });
  });

  const emits = defineEmits(['update:modelValue']);
  watch(
    () => formValues,
    (value) => {
      emits('update:modelValue', value);
    },
    { deep: true },
  );
  function initForm() {
    registerForm({
      formRef,
      initFormValue: props.modelValue,
    });
  }
  onMounted(() => {
    initForm();
    isMounted.value = true;
    console.log('formValue', formValues);
  });
  defineExpose(formApi);
</script>

<style scoped lang="scss"></style>
