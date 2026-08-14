import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HOME_PAGE.vue'
import Books from '../views/BOOKS_PAGE.vue'
import BookDetail from '../views/BOOK_DETAIL_PAGE.vue'
import Carrinho from '../views/CARRINHO_PAGE.vue'
import Checkout from '../views/CHECKOUT_PAGE.vue'
import OrderSuccess from '../views/ORDER_SUCCESS_PAGE.vue'
import Like from '../views/LIKE_PAGE.vue'
import Login from '../views/LOGIN_PAGE.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/livros',
      name: 'livros',
      component: Books
    },
    {
      path: '/livro/:id',
      name: 'livro',
      component: BookDetail
    },
    {
      path: '/carrinho',
      name: 'carrinho',
      component: Carrinho
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout
    },
    {
      path: '/pedido-confirmado',
      name: 'sucesso',
      component: OrderSuccess
    },
    {
      path: '/like',
      name: 'like',
      component: Like
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
