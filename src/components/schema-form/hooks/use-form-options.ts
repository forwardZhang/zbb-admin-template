import { shallowReactive } from 'vue';
import { get, set } from 'lodash-es';

function useFormOptions() {
  const optionsMap = shallowReactive({});

  function getOptions({ fieldName }) {
    return get(optionsMap, fieldName);
  }

  function setOptions({ fieldName, options = [] }) {
    set(optionsMap, fieldName, options ?? []);
  }

  return {
    getOptions,
    setOptions,
  };
}

export default useFormOptions;
