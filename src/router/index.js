import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import Layout from '../views/Layout'
import User from '../views/User'
import Search from '../views/Search/index.vue'
import SearchResult from '../views/Search/searchResult.vue'
import ArticleDetail from '@/views/ArticleDetail'
import UserInfo from '@/views/User/userInfo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/layout',
    component: Layout,
    redirect: '/layout/home',
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'user',
        component: User
      }
    ]
  },
  {
    path: '/userinfo',
    component: UserInfo
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/search/:keyword',
    component: SearchResult
  },
  {
    path: '/articledetail',
    component: ArticleDetail
  }
]

const router = new VueRouter({
  routes
})

export default router
