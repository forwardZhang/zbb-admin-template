import SchemaForm from './components/schema-form/index.vue';
import type { App } from 'vue';
export function bootstrapApp(app: App) {
  app.component('SchemaForm', SchemaForm);
}
