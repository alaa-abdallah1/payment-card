import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Profile from '@/views/profile/Index.vue'
import Payment from '@/views/payment/Index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/payment',
    name: 'Payment',
    component: Payment,
  },
  // Redirect to Userpage as default
  {
    path: '/',
    redirect: '/profile',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
