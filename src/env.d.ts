import SchemaForm from './components/schema-form/index.vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    SchemaForm: typeof SchemaForm;
  }
}
