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
          path: 'form',
          name: 'Form',
          component: () => import('@/views/components/form/index.vue'),
        },
        {
          path: 'vben-form',
          name: 'VbenForm',
          component: () => import('@/views/components/vben-form/index.vue'),
        },
      ],
    },
  ],
});

export default router;
