type FormItemDependenciesCondition<T = boolean | PromiseLike<boolean>> = (
  value: Partial<Record<string, any>>,
  actions: FormActions,
) => T;
type FormActions = ({ formValues, formApi }: { formValues: any; formApi: any }) => void;
export interface FormItemDependencies {
  /**
   * 是否禁用
   * @returns 是否禁用
   */
  disabled?: boolean | FormItemDependenciesCondition;
  /**
   * 是否渲染（删除dom）
   * @returns 是否渲染
   */
  if?: boolean | FormItemDependenciesCondition;
  /**
   * 是否必填
   * @returns 是否必填
   */
  required?: FormItemDependenciesCondition;
  /**
   * 字段规则
   */
  rules?: any;
  /**
   * 任意触发都会执行
   */
  trigger?: FormItemDependenciesCondition<void>;
  /**
   * 触发字段
   */
  triggerFields: string[];
}

export type ComponentType = 'text' | 'number' | 'select' | 'object' | 'array';
// 基础表单项
export interface BaseFormSchema {
  label: string;
  fieldName: string;
  type: ComponentType;
  formFieldProps?: any;
  componentProps?: any;
  dependencies?: FormItemDependencies;
  required?: boolean;
  rules?: any[];
  span?: number;
  properties?: FormSchema[];
  items?: FormSchema;
}
// 对象属性
export interface ObjectFormSchema extends BaseFormSchema {
  type: 'object';
  properties: FormSchema[];
}
// 数组项的定义
export interface ArrayFormSchema extends BaseFormSchema {
  type: 'array';
  getDefaultValue?: () => any;
  items: FormSchema;
}

export type FormSchema = BaseFormSchema | ObjectFormSchema | ArrayFormSchema;
