import { ref, computed, watch, onMounted } from 'vue';
import _ from 'lodash-es';
import { useSchemaForm } from './use-schema-form';

export function useSchemaField({ formData, propPath, schema }) {
  const formContext = useSchemaForm();

  // 计算当前字段的完整路径
  const fieldPath = computed(() => {
    return propPath ? `${propPath}.${schema.field}` : schema.field;
  });

  // 判断是否应该显示此字段
  const shouldShow = computed(() => {
    const { visible } = schema;
    if (typeof visible === 'function') {
      return visible(formData, formContext);
    }
    return visible !== false;
  });

  // 获取动态属性
  const getDynamicProps = (propName) => {
    const propValue = schema[propName];
    if (typeof propValue === 'function') {
      return propValue(formData, formContext);
    }
    return propValue;
  };

  // 处理选项依赖
  const options = ref([]);
  const loading = ref(false);

  const fetchOptions = async () => {
    const { options: optionsConfig } = schema;
    if (!optionsConfig) {
      options.value = [];
      return;
    }

    // 处理静态选项
    if (Array.isArray(optionsConfig)) {
      options.value = optionsConfig;
      return;
    }

    // 处理函数选项（支持异步）
    if (typeof optionsConfig === 'function') {
      loading.value = true;
      try {
        const result = await optionsConfig(formData, formContext);
        options.value = result || [];
      } catch (error) {
        console.error('获取选项失败:', error);
        options.value = [];
      } finally {
        loading.value = false;
      }
      return;
    }

    // 处理带依赖的选项配置
    if (optionsConfig && typeof optionsConfig === 'object') {
      const { dependencies, handler } = optionsConfig;

      // 如果有依赖项，检查依赖项是否有值
      if (dependencies && dependencies.length > 0) {
        const hasEmptyDependencies = dependencies.some((dep) => {
          const value = _.get(formData, dep);
          return value === undefined || value === null || value === '';
        });

        if (hasEmptyDependencies) {
          options.value = [];
          return;
        }
      }

      // 执行处理器函数
      if (typeof handler === 'function') {
        loading.value = true;
        try {
          const result = await handler(formData, formContext);
          options.value = result || [];
        } catch (error) {
          console.error('获取选项失败:', error);
          options.value = [];
        } finally {
          loading.value = false;
        }
      }
    }
  };

  // 初始化获取选项
  onMounted(() => {
    fetchOptions();
  });

  // 监听依赖变化重新获取选项
  if (schema.options && schema.options.dependencies) {
    watch(
      () => schema.options.dependencies.map((dep) => _.get(formData, dep)),
      () => {
        fetchOptions();
      },
      { deep: true },
    );
  }

  return {
    shouldShow,
    getDynamicProps,
    options,
    loading,
    fieldPath,
    fetchOptions,
  };
}
