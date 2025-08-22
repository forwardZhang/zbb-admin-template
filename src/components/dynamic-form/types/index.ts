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

export type ComponentType = 'text' | 'number' | 'select';
// 基础表单项
export interface FormSchema {
  label: string;
  fieldName: string;
  type: ComponentType;
  formFieldProps?: any;
  componentProps?: any;
  dependencies?: FormItemDependencies;
  required?: boolean;
  rules?: any[];
  span?: number;
}
