import type { Component } from 'vue';

// 表单组件属性类型
export type ComponentProps = Record<string, any>;

// 选项类型
export interface Option {
  label: string;
  value: any;
  [key: string]: any;
}

// 远程选项参数
export interface RemoteOptionsParams {
  formValue: Record<string, any>;
  dependentValues: Record<string, any>;
}

// 栅格布局属性
export interface RowProps {
  gutter?: number;
  type?: 'flex';
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  align?: 'top' | 'middle' | 'bottom';
  [key: string]: any;
}

export interface ColProps {
  span?: number;
  offset?: number;
  push?: number;
  pull?: number;
  xs?: number | { span?: number; offset?: number };
  sm?: number | { span?: number; offset?: number };
  md?: number | { span?: number; offset?: number };
  lg?: number | { span?: number; offset?: number };
  xl?: number | { span?: number; offset?: number };
  xxl?: number | { span?: number; offset?: number };
  [key: string]: any;
}

// 表单项 schema 基础类型
export interface BaseSchema {
  name: string; // 将 field 改为 name
  type: string;
  label?: string | ((formValue: Record<string, any>) => string);
  visible?: boolean | ((formValue: Record<string, any>) => boolean);
  disabled?: boolean | ((formValue: Record<string, any>) => boolean);
  rules?: any[] | ((formValue: Record<string, any>) => any[]);
  placeholder?: string | ((formValue: Record<string, any>) => string);
  defaultValue?: any;
  component?: Component;
  span?: number;
  componentProps?:
    | ComponentProps
    | ((params: { formApi: FormApi; schema: BaseSchema; path: string }) => ComponentProps); // field 改为 name
}

// 选择器类型 schema
export interface SelectSchema extends BaseSchema {
  type: 'select' | 'radio' | 'checkbox';
  options?: Option[] | ((params: RemoteOptionsParams) => Promise<Option[]> | Option[]);
  optionsDependencies?: string[]; // 依赖的字段列表，用于触发选项重新加载
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
    fields: BaseSchema;
  };
}

// 联合所有 schema 类型
export type Schema = BaseSchema | SelectSchema | ObjectSchema | ArraySchema;

// 表单 API 类型
export interface FormApi {
  getFormValue: () => Record<string, any>;
  setFormValue: (value: Record<string, any>, emitChange?: boolean) => void;
  getFieldValue: (name: string) => any; // field 改为 name
  setFieldValue: (name: string, value: any, emitChange?: boolean) => void; // field 改为 name
  validate: () => Promise<boolean>;
  validateField: (name: string) => Promise<void>; // field 改为 name
  resetFields: () => void;
  getFormRef: () => any;
}

// SchemaForm 组件属性
export interface SchemaFormProps {
  schemas: Schema[];
  modelValue?: Record<string, any>;
  labelWidth?: string | number;
  inline?: boolean;
  labelPosition?: 'left' | 'right' | 'top';
  disabled?: boolean;
}

// SchemaForm 组件事件
export interface SchemaFormEmits {
  (e: 'submit', value: Record<string, any>): void;
  (e: 'change', value: Record<string, any>): void;
  (e: 'update:modelValue', value: Record<string, any>): void;
}
