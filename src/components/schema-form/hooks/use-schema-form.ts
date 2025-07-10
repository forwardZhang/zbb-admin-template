import { h, reactive, ref } from 'vue';
import SchemaForm from '../index.vue';

function useSchemaForm(props: any) {
  const formRef = ref();
  const FormComponent = (_: any, { slots }: any) => {
    return h(
      SchemaForm,
      {
        ...reactive(props),
        ref: formRef,
      },
      slots,
    );
  };
  return {
    UseSchemaForm: FormComponent,
    validate: () => {
      return formRef.value?.validate();
    },
    formRef,
  };
}
export default useSchemaForm;
