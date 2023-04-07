// 基于axios封装网络请求
import theAxios from 'axios'
import router from '@/router'
import { Notify } from 'vant'
import { getToken } from './token'
const axios = theAxios.create({
  baseURL: 'http://toutiao.itheima.net/',
  timeout: 20000
})

// 添加拦截器，本质函数
// 响应拦截器：响应之前浏览器做些什么
axios.interceptors.response.use(function (response) {
  // 状态码为2xx/3xx开头进这里，对响应数据做点什么
  return response
}, async function (error) {
  // 响应状态码4xx/5xx进这里，对响应错误做点什么
  if (error.response.status === 401) { // 身份过期
    // token续签方式1:  去登录页重新登录
    Notify({ type: 'warning', message: '请重新登录' })
    router.replace({ path: '/login' })
  }

  return Promise.reject(error)
})
// // 请求拦截器：发送请求之前做些什么
axios.interceptors.request.use(function (config) {
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}
