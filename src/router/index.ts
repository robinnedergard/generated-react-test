import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomePage.vue'),
    },
    {
      path: '/products',
      name: 'Products',
      component: () => import('../views/ProductsPage.vue'),
    },
    {
      path: '/product/:id',
      name: 'Product',
      component: () => import('../views/ProductPage.vue'),
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('../views/CheckoutPage.vue'),
    },
    {
      path: '/checkout/:id/success',
      name: 'CheckoutSuccess',
      component: () => import('../views/CheckoutSuccessPage.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginPage.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterPage.vue'),
    },
    {
      path: '/account/orders',
      name: 'UserOrders',
      component: () => import('../views/UserOrdersPage.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guard for protected routes
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const auth = useAuth()
      if (!auth.isAuthenticated) {
        next({ name: 'Login', query: { from: to.fullPath } })
      } else {
        next()
      }
    } catch {
      // Auth not provided, redirect to login
      next({ name: 'Login', query: { from: to.fullPath } })
    }
  } else {
    next()
  }
})

export default router

