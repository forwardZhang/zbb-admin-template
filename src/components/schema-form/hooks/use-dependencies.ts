import { computed, ref, watch } from 'vue';
import { get, isBoolean, isFunction, isNil } from 'lodash-es';

export default function useDependencies({
  getDependencies,
  formData,
  formApi,
  path,
}: {
  getDependencies: () => any | undefined;
  formData: any;
  formApi: any;
  path: string;
}) {
  if (!formData) {
    throw new Error('form formData is null');
  }

  const visible = ref(true);
  const isDisabled = ref<boolean | undefined>(undefined);
  const dynamicComponentProps = ref<any>({});
  const dynamicFormItemProps = ref<any>({});
  const dynamicRules = ref<any>([]);

  const triggerFieldValues = computed(() => {
    // 该字段可能会被多个字段触发
    const triggerFields = getDependencies?.()?.triggerFields ?? [];
    return triggerFields.map((dep: string) => {
      return get(formData, dep);
    });
  });

  const resetConditionState = () => {
    isDisabled.value = undefined;
    visible.value = true;
    dynamicRules.value = [];
    dynamicComponentProps.value = {};
    dynamicFormItemProps.value = {};
  };

  watch(
    [triggerFieldValues, getDependencies],
    async ([_values, dependencies]) => {
      if (!dependencies || !dependencies?.triggerFields?.length) {
        return;
      }
      resetConditionState();
      const { componentProps, disabled, visible: whenVisible, rules, trigger } = dependencies;

      // 1. 优先判断visible，如果if为false，则不渲染dom，后续判断也不再执行

      const commonArgs = { value: get(formData, path), formData, formApi, path };

      if (isFunction(whenVisible)) {
        visible.value = !!(await whenVisible(commonArgs));
        // 不渲染
        if (!visible.value) return;
      } else if (isBoolean(whenVisible)) {
        visible.value = whenVisible;
        if (!visible.value) return;
      }

      if (isFunction(componentProps)) {
        dynamicComponentProps.value = await componentProps(commonArgs);
      }
      if (isFunction(dynamicFormItemProps)) {
        dynamicFormItemProps.value = await dynamicFormItemProps(commonArgs);
      }

      if (isFunction(rules)) {
        dynamicRules.value = await rules(commonArgs);
      }

      if (isNil(disabled)) {
        isDisabled.value = undefined;
      } else if (isFunction(disabled)) {
        isDisabled.value = !!(await disabled(commonArgs));
      } else if (isBoolean(disabled)) {
        isDisabled.value = disabled;
      }

      if (isFunction(trigger)) {
        await trigger(commonArgs);
      }
    },
    { deep: true, immediate: true },
  );

  return {
    dynamicComponentProps,
    dynamicFormItemProps,
    dynamicRules,
    isDisabled,
    visible,
  };
}
