import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/applications/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/currentcy_exchange',
      name: 'Currentcy Exchange',
      component: () => import('@/views/applications/CurrencyExchangeView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = typeof to.name === 'string' ? to.name : 'App'
  next()
})

export default router
