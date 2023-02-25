import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: () => {
      return '/home'
    },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/Index.vue'),
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/detail/Index.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
