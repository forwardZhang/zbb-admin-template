import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/components',
      name: 'components',
      children: [
        {
          path: 'form',
          name: 'form',
          component: () => import('@/views/components/form/index.vue'),
        },
      ],
    },
  ],
})

export default router
