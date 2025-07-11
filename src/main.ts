import './styles/index.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import { bootstrapApp } from './bootstrap.ts';

const app = createApp(App);

bootstrapApp(app);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.mount('#app');
