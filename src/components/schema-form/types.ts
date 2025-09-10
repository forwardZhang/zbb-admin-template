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
  field: string;
  type: string;
  label?: string | ((formValue: Record<string, any>) => string);
  visible?: boolean | ((formValue: Record<string, any>) => boolean);
  disabled?: boolean | ((formValue: Record<string, any>) => boolean);
  rules?: any[] | ((formValue: Record<string, any>) => any[]);
  placeholder?: string | ((formValue: Record<string, any>) => string);
  defaultValue?: any;
  component?: Component;
  componentProps?:
    | ComponentProps
    | ((params: { formApi: FormApi; schema: BaseSchema; field: string }) => ComponentProps);

  // 布局相关配置
  useRowCol?: boolean; // 是否使用栅格布局
  rowProps?: RowProps | ((formValue: Record<string, any>) => RowProps); // 传递给el-row的属性
  colProps?: ColProps | ((formValue: Record<string, any>) => ColProps); // 传递给el-col的属性

  [key: string]: any;
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
  properties: BaseSchema[];
  collapse?: boolean; // 是否可折叠
}

// 数组类型 schema
export interface ArraySchema extends BaseSchema {
  type: 'array';
  items: BaseSchema;
  minLength?: number;
  maxLength?: number;
  addText?: string;
  removeText?: string;
  itemLabel?: (item: any, index: number) => string;
}

// 联合所有 schema 类型
export type Schema = BaseSchema | SelectSchema | ObjectSchema | ArraySchema;

// 表单 API 类型
export interface FormApi {
  getFormValue: () => Record<string, any>;
  setFormValue: (value: Record<string, any>, emitChange?: boolean) => void;
  getFieldValue: (field: string) => any;
  setFieldValue: (field: string, value: any, emitChange?: boolean) => void;
  validate: () => Promise<boolean>;
  validateField: (field: string) => Promise<void>;
  resetFields: () => void;
  getFormRef: () => any;
}

// SchemaForm 组件属性
export interface SchemaFormProps {
  schemas: Schema[];
  modelValue?: Record<string, any>;
  labelWidth?: string | number;
  disabled?: boolean;
  // 全局默认是否使用栅格布局
  defaultUseRowCol?: boolean;
  // 全局默认栅格属性
  defaultRowProps?: RowProps;
  defaultColProps?: ColProps;
}

// SchemaForm 组件事件
export interface SchemaFormEmits {
  (e: 'submit', value: Record<string, any>): void;
  (e: 'change', value: Record<string, any>): void;
  (e: 'update:modelValue', value: Record<string, any>): void;
}
