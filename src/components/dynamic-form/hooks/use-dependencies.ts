import { computed, ref, watch } from 'vue';
import { isBoolean, isFunction, isNil } from 'lodash-es';

export default function useDependencies({
  getDependencies,
  formValues,
  formApi,
}: {
  getDependencies: () => any | undefined;
  formValues: any;
  formApi: any;
}) {
  if (!formValues) {
    throw new Error('form values is null');
  }

  const isIf = ref(true);
  const isDisabled = ref<boolean | undefined>(undefined);
  const isShow = ref(true);
  const isRequired = ref(false);
  const dynamicComponentProps = ref<any>({});
  const dynamicRules = ref<any>([]);

  const triggerFieldValues = computed(() => {
    // 该字段可能会被多个字段触发
    const triggerFields = getDependencies()?.triggerFields ?? [];
    return triggerFields.map((dep: string) => {
      return formValues[dep];
    });
  });

  const resetConditionState = () => {
    isDisabled.value = undefined;
    isIf.value = true;
    isShow.value = true;
    isRequired.value = false;
    dynamicRules.value = [];
    dynamicComponentProps.value = {};
  };

  watch(
    [triggerFieldValues, getDependencies],
    async ([_values, dependencies]) => {
      if (!dependencies || !dependencies?.triggerFields?.length) {
        return;
      }
      resetConditionState();
      const { componentProps, disabled, if: whenIf, required, rules, show, trigger } = dependencies;

      // 1. 优先判断if，如果if为false，则不渲染dom，后续判断也不再执行
      // const formValues = formValues;

      if (isFunction(whenIf)) {
        isIf.value = !!(await whenIf({ formValues, formApi }));
        // 不渲染
        if (!isIf.value) return;
      } else if (isBoolean(whenIf)) {
        isIf.value = whenIf;
        if (!isIf.value) return;
      }

      // 2. 判断show，如果show为false，则隐藏
      if (isFunction(show)) {
        isShow.value = !!(await show({ formValues, formApi }));
        if (!isShow.value) return;
      } else if (isBoolean(show)) {
        isShow.value = show;
        if (!isShow.value) return;
      }

      if (isFunction(componentProps)) {
        dynamicComponentProps.value = await componentProps({ formValues, formApi });
      }

      if (isFunction(rules)) {
        dynamicRules.value = await rules({ formValues, formApi });
      }

      if (isNil(disabled)) {
        isDisabled.value = undefined;
      } else if (isFunction(disabled)) {
        isDisabled.value = !!(await disabled({ formValues, formApi }));
      } else if (isBoolean(disabled)) {
        isDisabled.value = disabled;
      }

      if (isFunction(trigger)) {
        await trigger({ formValues, formApi });
      }
    },
    { deep: true, immediate: true },
  );

  return {
    dynamicComponentProps,
    dynamicRules,
    isDisabled,
    isIf,
    isShow,
  };
}
