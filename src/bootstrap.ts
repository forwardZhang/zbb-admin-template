import SchemaForm from './components/schema-form/index.vue';
import type { App } from 'vue';
import { initComponentAdapter } from '@/components/vben-form/component-map.ts';
export async function bootstrapApp(app: App) {
  await initComponentAdapter();
  app.component('SchemaForm', SchemaForm);
}
