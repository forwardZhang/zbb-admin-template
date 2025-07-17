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
        <template v-for="cSchema in computedSchema" :key="cSchema.fieldName">
          <FormField v-bind="cSchema" :class="cSchema.formItemClass" :rules="cSchema.rules">
            <template #default="slotProps">
              <slot v-bind="slotProps" :name="cSchema.fieldName"></slot>
            </template>
          </FormField>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, useId, useTemplateRef, watch } from 'vue';

  import FormField from './components/form-field.vue';
  import { useFormApi } from './hooks/use-form-api.ts';
  import type { FormInstance } from 'element-plus';
  import { provideFormApi } from './hooks/use-form-context';
  import { cloneDeep } from 'lodash-es';

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
