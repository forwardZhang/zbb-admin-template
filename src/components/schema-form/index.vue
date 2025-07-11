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
  import { type Component, h, useTemplateRef } from 'vue';
  import {
    ElCheckbox,
    ElCheckboxGroup,
    ElInput,
    ElInputNumber,
    ElOption,
    ElRadio,
    ElRadioGroup,
    ElSelect,
    type FormInstance,
    type FormRules,
  } from 'element-plus';
  import { omit } from 'lodash-es';

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

  const ComponentItem = {
    props: {
      field: {
        type: Object,
      },
    },
    setup(_props: any) {
      const field = _props.field;
      return () =>
        h(
          getComponent(field),
          {
            ...getFieldProps(field),
            modelValue: formData.value[field.name],
            'onUpdate:modelValue': (value: any) => {
              formData.value[field.name] = value;
            },
          },
          field.slots,
        );
    },
  };

  function getComponent(field: any) {
    const type = field.type;
    if (typeof type !== 'string') return type;
    return componentsMap[type];
  }

  function transformSelectOption(component: Component, optionComponent: Component) {
    return (_props: any, { attrs: _attrs }: any) => {
      console.log('render');
      const options = _props?.options ?? [];
      const labelField = _props?.labelField ?? 'label';
      const valueField = _props?.valueField ?? 'value';
      const omitProps = omit(_props, ['options', 'labelField', 'valueField']);
      return h(component, omitProps, () =>
        options.map((item: any) =>
          h(optionComponent, { label: item[labelField], value: item[valueField] }, item.slots),
        ),
      );
    };
  }

  const componentsMap: Record<string, any> = {
    input: ElInput,
    number: ElInputNumber,
    select: transformSelectOption(ElSelect, ElOption),
    radio: transformSelectOption(ElRadioGroup, ElRadio),
    checkbox: transformSelectOption(ElCheckboxGroup, ElCheckbox),
  };

  function getFieldProps(field: any) {
    //todo console.log('getFieldProps');
    if (field.props) return field.props;
    return {};
  }

  function validate() {
    return formRef.value?.validate();
  }

  defineExpose({
    validate,
  });
</script>

<style scoped lang="scss"></style>
