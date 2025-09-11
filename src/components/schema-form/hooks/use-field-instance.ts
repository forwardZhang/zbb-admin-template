import { shallowReactive } from 'vue';
import { get, set } from 'lodash-es';

function useFieldInstance() {
  const fieldInstanceMap = shallowReactive({});
  function setFieldInstance(fieldName: string, instance: any) {
    set(fieldInstanceMap, fieldName, instance);
  }
  function getFieldInstance(fieldName: string) {
    get(fieldInstanceMap, fieldName);
  }

  return {
    getFieldInstance,
    setFieldInstance,
  };
}

export default useFieldInstance;
