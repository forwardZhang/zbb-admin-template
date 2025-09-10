import type { Component } from 'vue';
import {
  ElInput,
  ElSelect,
  ElRadioGroup,
  ElCheckboxGroup,
  ElInputNumber,
  ElSwitch,
  ElDatePicker,
  ElTimePicker,
  ElSlider,
  ElRate,
} from 'element-plus';
import ObjectField from './object-field/index.vue';
import ArrayField from './array-field/index.vue';

// 基础组件映射
export const componentMap: Record<string, Component> = {
  input: ElInput,
  select: ElSelect,
  radio: ElRadioGroup,
  checkbox: ElCheckboxGroup,
  number: ElInputNumber,
  switch: ElSwitch,
  date: ElDatePicker,
  time: ElTimePicker,
  slider: ElSlider,
  rate: ElRate,
  object: ObjectField,
  array: ArrayField,
};
