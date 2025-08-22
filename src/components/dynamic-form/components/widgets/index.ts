import type { Component } from 'vue';

import TextField from './text-field/index.vue';
import NumberField from './number-field/index.vue';
import SelectField from './select-field/index.vue';
import ObjectField from './object-field/index.vue';
import ArrayField from './array-field/index.vue';
import type { ComponentType } from '@/components/dynamic-form/types';

const componentMap: Record<ComponentType, Component> = {
  text: TextField,
  number: NumberField,
  select: SelectField,
  object: ObjectField,
  array: ArrayField,
};

export function getWidgetComponent(type: ComponentType) {
  console.log('type', type);
  return componentMap[type];
}
