import { SchemaForm } from './components/schema-form/index.ts';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    SchemaForm: typeof SchemaForm;
  }
}
