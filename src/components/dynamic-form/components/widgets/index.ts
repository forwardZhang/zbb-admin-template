import type { Component } from 'vue';

import TextField from './text-field/index.vue';
import NumberField from './number-field/index.vue';
import SelectField from './select-field/index.vue';
import type { ComponentType } from '@/components/dynamic-form/types';

const componentMap: Record<ComponentType, Component> = {
  text: TextField,
  number: NumberField,
  select: SelectField,
};

export function getWidgetComponent(type: ComponentType) {
  return componentMap[type];
}
