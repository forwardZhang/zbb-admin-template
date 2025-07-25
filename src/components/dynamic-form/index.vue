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
        <el-row :gutter="16">
          <el-col v-for="field in computedSchema" :span="field.span ?? 24" :key="field.fieldName">
            <FormField v-bind="field">
              <template #default="slotProps">
                <slot v-bind="slotProps" :name="field.fieldName"></slot>
              </template>
            </FormField>
          </el-col>
        </el-row>
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
  import FormField from '@/components/dynamic-form/components/form-field.vue';
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
    return (props.schema || []).map((schema, index) => {
      return {
        ...schema,
        commonComponentProps: {},
        componentProps: schema.componentProps,
        formFieldProps: {
          // ...formFieldProps,
          ...schema.formFieldProps,
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
    isMounted.value = true;
  }
  onMounted(() => {
    initForm();
  });
  defineExpose(formApi);
</script>

<style scoped lang="scss"></style>
