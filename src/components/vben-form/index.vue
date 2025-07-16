<template>
  <div>
    <el-form :model="formData" :rules="rules" label-position="left" ref="formRef">
      <div ref="wrapperRef" class="form-wrapper">
        <template v-for="cSchema in computedSchema" :key="cSchema.fieldName">
          <FormField
            v-bind="cSchema"
            :class="cSchema.formItemClass"
            :rules="cSchema.rules"
            v-model="formData"
          >
            <template #default="slotProps">
              <slot v-bind="slotProps" :name="cSchema.fieldName"> </slot>
            </template>
          </FormField>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { computed, useId } from 'vue';

  import FormField from './components/form-field.vue';
  const props = defineProps<{
    rules: any[];
    schema: any[];
  }>();
  const formData = defineModel<any>();

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
</script>

<style scoped lang="scss"></style>
