<template>
  <el-form-item :prop="field.name" v-bind="field.itemProps ?? {}">
    <template #label>{{ field.label }}</template>
    <slot v-if="field.slotName" :name="field.slotName" v-bind="{ field, model: formData }"></slot>
    <ComponentItem v-else :field="field" />
  </el-form-item>
</template>

<script setup lang="ts">
  import { type Component, defineComponent, h } from 'vue';
  import {
    ElCheckbox,
    ElCheckboxGroup,
    ElInput,
    ElInputNumber,
    ElOption,
    ElRadio,
    ElRadioGroup,
    ElSelect,
  } from 'element-plus';
  import { get, omit, set } from 'lodash-es';

  const props = defineProps({
    field: {
      type: Object,
      required: true,
    },
  });

  const formData = defineModel<any>();

  const ComponentItem = defineComponent({
    props: {
      field: {
        type: Object,
        required: true,
      },
    },
    setup(_props) {
      return () =>
        h(
          getComponent(_props.field),
          {
            ...getFieldProps(_props.field),
            modelValue: get(formData.value, _props.field.name),
            'onUpdate:modelValue': (value: any) => {
              set(formData.value, _props.field.name, value);
            },
          },
          _props.field.slots,
        );
    },
  });

  function getComponent(field: any) {
    const type = field.type;
    if (typeof type !== 'string') return type;
    return componentsMap[type];
  }

  function transformSelectOption(component: Component, optionComponent: Component) {
    return (_props: any, { attrs: _attrs }: any) => {
      const options = _props?.options ?? [];
      const labelField = _props?.labelField ?? 'label';
      const valueField = _props?.valueField ?? 'value';
      const omitProps = omit(_props, ['options', 'labelField', 'valueField', 'span']);
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
    if (field.props) return field.props;
    return {};
  }
</script>
