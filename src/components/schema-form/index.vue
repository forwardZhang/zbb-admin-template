<template>
  <el-form :model="formData" :rules="rules" label-position="left" ref="formRef">
    <el-row :gutter="16">
      <el-col :span="field.span ?? 24" v-for="field in schema" :key="field.name">
        <el-form-item :label="field.label" :prop="field.name" v-bind="field.itemProps ?? {}">
          <slot :name="field.slotName" v-if="field.slotName"> </slot>
          <ComponentItem :field="field" v-else />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
  import { type Component, defineComponent, h, useTemplateRef } from 'vue';
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
    name: 'UseForm',
    inheritAttrs: false,
  });

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
  const ComponentItemData2 = {
    setup(_props: any) {
      return () => h('div', 'hello world');
    },
  };
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
