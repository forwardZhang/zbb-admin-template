import type { Component } from 'vue';

import { defineAsyncComponent, defineComponent, getCurrentInstance, h, ref } from 'vue';
import {
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElDatePicker,
  ElDivider,
  ElInput,
  ElInputNumber,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElSelectV2,
  ElSpace,
  ElSwitch,
  ElTimePicker,
  ElTreeSelect,
  ElUpload,
} from 'element-plus';
import type { ComponentType } from '@/components/dynamic-form/types';

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
  componentProps: any = {},
) => {
  return defineComponent({
    name: component.name,
    inheritAttrs: false,
    setup: (props: any, { attrs, expose, slots }) => {
      console.log('props', props);
      console.log('attrs', attrs);
      const placeholder =
        props?.placeholder ||
        attrs?.placeholder ||
        `请${type === 'input' ? '输入' : '选择'}${props.label ?? ''}`;
      return () => h(component, { ...componentProps, placeholder, ...props, ...attrs }, slots);
    },
  });
};

export const componentMap: Record<ComponentType, Component> = {
  Checkbox: ElCheckbox,
  CheckboxGroup: (props, { attrs, slots }) => {
    let defaultSlot;
    if (Reflect.has(slots, 'default')) {
      defaultSlot = slots.default;
    } else {
      const { options, isButton } = attrs;
      if (Array.isArray(options)) {
        defaultSlot = () =>
          options.map((option) => h(isButton ? ElCheckboxButton : ElCheckbox, option));
      }
    }
    return h(ElCheckboxGroup, { ...props, ...attrs }, { ...slots, default: defaultSlot });
  },
  Divider: ElDivider,
  Input: withDefaultPlaceholder(ElInput, 'input'),
  InputNumber: withDefaultPlaceholder(ElInputNumber, 'input'),
  RadioGroup: (props, { attrs, slots }) => {
    let defaultSlot;
    if (Reflect.has(slots, 'default')) {
      defaultSlot = slots.default;
    } else {
      const { options } = attrs;
      if (Array.isArray(options)) {
        defaultSlot = () =>
          options.map((option) => h(attrs.isButton ? ElRadioButton : ElRadio, option));
      }
    }
    return h(ElRadioGroup, { ...props, ...attrs }, { ...slots, default: defaultSlot });
  },
  Select: (props, { attrs, slots }) => {
    return h(ElSelectV2, { ...props, attrs }, slots);
  },
  Space: ElSpace,
  Switch: ElSwitch,
  TimePicker: (props, { attrs, slots }) => {
    const { name, id, isRange } = props;
    const extraProps: any = {};
    if (isRange) {
      if (name && !Array.isArray(name)) {
        extraProps.name = [name, `${name}_end`];
      }
      if (id && !Array.isArray(id)) {
        extraProps.id = [id, `${id}_end`];
      }
    }
    return h(
      ElTimePicker,
      {
        ...props,
        ...attrs,
        ...extraProps,
      },
      slots,
    );
  },
  DatePicker: (props, { attrs, slots }) => {
    const { name, id, type } = props;
    const extraProps: any = {};
    if (type && type.includes('range')) {
      if (name && !Array.isArray(name)) {
        extraProps.name = [name, `${name}_end`];
      }
      if (id && !Array.isArray(id)) {
        extraProps.id = [id, `${id}_end`];
      }
    }
    return h(
      ElDatePicker,
      {
        ...props,
        ...attrs,
        ...extraProps,
      },
      slots,
    );
  },
  TreeSelect: withDefaultPlaceholder(ElTreeSelect, 'select'),
  Upload: ElUpload,
};
