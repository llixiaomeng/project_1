import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
// import Home from '../views/Home'
import Layout from '../views/Layout'
// import User from '../views/User'
// import Search from '../views/Search/index.vue'
// import SearchResult from '../views/Search/searchResult.vue'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserInfo from '@/views/User/userInfo'
// import Chat from '@/views/Chat'
import { getToken } from '@/utils/token'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout'
  },
  {
    path: '/login',
    component: Login,
    beforeEnter (to, from, next) {
      if (getToken()?.length > 0) return next(false)
      next()
    }
  },
  {
    path: '/layout',
    component: Layout,
    redirect: '/layout/home',
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkNme:"Home" */ '../views/Home'),
        meta: {
          scrollT: 0
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkNme:"User" */ '../views/User')
      }
    ]
  },
  {
    path: '/userinfo',
    component: () => import(/* webpackChunkNme:"UserInfo" */ '@/views/User/userInfo')
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkNme:"Search" */ '../views/Search/index.vue')
  },
  {
    path: '/search/:keyword',
    component: () => import(/* webpackChunkNme:"SearchResult" */ '../views/Search/searchResult.vue')
  },
  {
    path: '/articledetail',
    component: () => import(/* webpackChunkNme:"ArticleDetail" */ '@/views/ArticleDetail')
  },
  {
    path: '/chat',
    component: () => import(/* webpackChunkNme:"Chat" */ '@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})

export default router
