// 表单组件属性类型
import type { Component } from 'vue';

export type ComponentProps = Record<string, any>;
export type FormParams = {
  value: any;
  formData: Record<string, any>;
  formApi: any;
  path: string;
};

// formItem 和 components 依赖项
export interface FormItemDependencies {
  disabled?: boolean | ((params: FormParams) => boolean | Promise<boolean>);
  if?: boolean | ((params: FormParams) => boolean | Promise<boolean>);
  rules?: (params: FormParams) => any[] | Promise<any[]>;
  trigger?: (params: FormParams) => void | Promise<void>;
  triggerFields: string[];
}

export type ComponentType = any;

// 表单项 schema 基础类型
export interface BaseSchema {
  type: ComponentType;
  name: string;
  formFieldProps?: any;
  dependencies?: FormItemDependencies;
  required?: boolean;
  hideLabel?: boolean;
  labelWidth?: string | number;
  label?: string;
  rules?: any[];
  placeholder?: string;
  component?: Component;
  span?: number;
  formItemProps?: ComponentProps;
  componentProps?: ComponentProps;
}

// 对象类型 schema
export interface ObjectSchema extends BaseSchema {
  type: 'object';
  fields: BaseSchema[]; // 将 properties 改为 fields
  inline?: boolean; // 是否可折叠
}

// 数组类型 schema
export interface ArraySchema extends BaseSchema {
  type: 'array';
  minLength?: number;
  maxLength?: number;
  addText?: string;
  removeText?: string;
  getDefaultItem?: () => any;
  rowKey?: string;
  item: {
    label?: string;
    name?: string;
    type: 'object';
    component?: Component;
    fields: BaseSchema[];
  };
}

// 联合所有 schema 类型
export type Schema = BaseSchema | ObjectSchema | ArraySchema;

// 表单 API 类型
export interface FormApi {
  getFormValue: () => Record<string, any>;
}

// SchemaForm 组件属性
export interface SchemaFormProps {
  schemas: Schema[];
  modelValue: Record<string, any>;
  labelWidth?: string | number;
  inline?: boolean;
  labelPosition?: 'left' | 'right' | 'top';
  disabled?: boolean;
  formProps?: Record<string, any>;
}

// SchemaForm 组件事件
export interface SchemaFormEmits {
  (e: 'submit', value: Record<string, any>): void;

  (e: 'change', value: Record<string, any>): void;

  (e: 'update:modelValue', value: Record<string, any>): void;
}
