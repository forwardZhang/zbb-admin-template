import { get, set } from 'lodash-es';
import type { FormApi, BaseSchema } from '../types';

/**
 * 获取对象中指定路径的值
 * @param obj 目标对象
 * @param path 路径字符串，如 'a.b[0].c'
 * @param defaultValue 默认值
 * @returns 路径对应的值
 */
export const getValue = (obj: Record<string, any>, path: string, defaultValue?: any) => {
  return get(obj, path, defaultValue);
};

/**
 * 设置对象中指定路径的值
 * @param obj 目标对象
 * @param path 路径字符串，如 'a.b[0].c'
 * @param value 要设置的值
 * @returns 修改后的对象
 */
export const setValue = (obj: Record<string, any>, path: string, value: any) => {
  return set(obj, path, value);
};

/**
 * 计算动态属性（支持函数或静态值）
 * @param params 参数对象
 * @param params.prop 要计算的属性名
 * @param params.schema 表单项schema
 * @param params.formApi 表单API
 * @param params.field 字段名
 * @returns 计算后的值
 */
export const computeDynamicProp = ({
  prop,
  schema,
  formApi,
  field,
}: {
  prop: string;
  schema: BaseSchema;
  formApi: FormApi;
  field: string;
}) => {
  const value = schema[prop];
  if (typeof value === 'function') {
    return value({
      formValue: formApi.getFormValue(),
      formApi,
      field,
      schema,
    });
  }
  return value;
};

/**
 * 解析字段依赖，获取依赖字段的值
 * @param dependencies 依赖字段列表
 * @param formApi 表单API
 * @returns 依赖字段值的映射
 */
export const resolveDependencies = (dependencies: string[], formApi: FormApi) => {
  return dependencies.reduce(
    (acc, dep) => {
      acc[dep] = formApi.getFieldValue(dep);
      return acc;
    },
    {} as Record<string, any>,
  );
};

/**
 * 计算布局属性（rowProps和colProps）
 * @param schema 表单项schema
 * @param formApi 表单API
 * @param prop 要计算的属性名（rowProps或colProps）
 * @returns 计算后的布局属性
 */
export const computeLayoutProps = (
  schema: BaseSchema,
  formApi: FormApi,
  prop: 'rowProps' | 'colProps',
) => {
  const props = schema[prop] || {};
  if (typeof props === 'function') {
    return props(formApi.getFormValue());
  }
  return props;
};
