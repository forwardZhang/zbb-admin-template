<template>
  <div>
    {{ formValues }}
    <el-form
      ref="formRef"
      :model="formValues"
      :rules="rules"
      label-position="left"
      class="dynamic-form"
    >
      <div ref="wrapperRef" class="form-wrapper">
        <FieldRender :fields="computedSchema"></FieldRender>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, useId, useSlots, useTemplateRef, watch } from 'vue';
  import { useFormApi } from './hooks/use-form-api.ts';
  import type { FormInstance } from 'element-plus';
  import { provideFormApi } from './hooks/use-form-context';
  import { cloneDeep } from 'lodash-es';
  import FieldRender from './components/field-render.vue';
  const props = defineProps<{
    rules: any;
    schema: any[];
    modelValue?: any;
    defaultFormValue?: any;
  }>();
  const isMounted = ref(false);
  const formRef = useTemplateRef<FormInstance>('formRef');
  const formApi = useFormApi();
  const { registerForm, formValues } = formApi;
  provideFormApi(formApi);
  const emits = defineEmits(['update:modelValue']);

  const computedSchema = computed(() => {
    return (props.schema || []).map((field, index) => {
      return {
        ...field,
        commonComponentProps: {},
        componentProps: field.componentProps,
        formFieldProps: {
          // ...formFieldProps,
          ...field.formFieldProps,
        },
      };
    });
  });

  function initForm() {
    registerForm({
      formRef,
      formValues: props.modelValue ? cloneDeep(props.modelValue) : (props.defaultFormValue ?? {}),
    });

    if (props.modelValue) {
      watch(
        () => formValues,
        (newValue) => {
          emits('update:modelValue', newValue);
        },
        {
          deep: true,
        },
      );
    }
  }
  onMounted(() => {
    initForm();
    isMounted.value = true;
  });
  defineExpose(formApi);
</script>

<style scoped lang="scss"></style>
