import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Layout from '@/components/Layout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: { public: true }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '数据概览', icon: 'Odometer' }
        },
        {
          path: 'users',
          name: 'Users',
          component: () => import('@/views/users/index.vue'),
          meta: { title: '用户管理', icon: 'User' }
        },
        {
          path: 'products',
          name: 'Products',
          component: () => import('@/views/products/index.vue'),
          meta: { title: '商品管理', icon: 'Goods' }
        },
        {
          path: 'products/category',
          name: 'ProductCategory',
          component: () => import('@/views/products/category.vue'),
          meta: { title: '商品分类', icon: 'FolderOpened', hidden: true }
        },
        {
          path: 'orders',
          name: 'Orders',
          component: () => import('@/views/orders/index.vue'),
          meta: { title: '订单管理', icon: 'Document' }
        },
        {
          path: 'orders/detail/:id',
          name: 'OrderDetail',
          component: () => import('@/views/orders/detail.vue'),
          meta: { title: '订单详情', hidden: true }
        },
        {
          path: 'inventory',
          name: 'Inventory',
          component: () => import('@/views/inventory/index.vue'),
          meta: { title: '库存管理', icon: 'Box' }
        },
        {
          path: 'inventory/records',
          name: 'InventoryRecords',
          component: () => import('@/views/inventory/records.vue'),
          meta: { title: '库存记录', hidden: true }
        },
        {
          path: 'prescriptions',
          name: 'Prescriptions',
          component: () => import('@/views/prescriptions/index.vue'),
          meta: { title: '处方管理', icon: 'FirstAidKit' }
        },
        {
          path: 'delivery',
          name: 'Delivery',
          component: () => import('@/views/delivery/index.vue'),
          meta: { title: '配送管理', icon: 'Van' }
        },
        {
          path: 'members',
          name: 'Members',
          component: () => import('@/views/members/index.vue'),
          meta: { title: '会员管理', icon: 'Medal' }
        },
        {
          path: 'marketing',
          name: 'Marketing',
          component: () => import('@/views/marketing/index.vue'),
          meta: { title: '营销管理', icon: 'Present' }
        },
        {
          path: 'finance',
          name: 'Finance',
          component: () => import('@/views/finance/index.vue'),
          meta: { title: '财务管理', icon: 'Money' }
        },
        {
          path: 'statistics',
          name: 'Statistics',
          component: () => import('@/views/statistics/index.vue'),
          meta: { title: '数据统计', icon: 'TrendCharts' }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/views/settings/index.vue'),
          meta: { title: '系统设置', icon: 'Setting' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/error/404.vue')
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.public) {
    next()
    return
  }
  
  if (!userStore.token) {
    next('/login')
    return
  }
  
  next()
})

export default router
