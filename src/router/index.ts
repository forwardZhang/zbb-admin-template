import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/home/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/components',
      name: 'components',
      children: [
        {
          path: 'schema-form',
          name: 'SchemaForm',
          component: () => import('@/views/components/sc-form/index.vue'),
        },
      ],
    },
  ],
});

export default router;
