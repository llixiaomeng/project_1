import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/VantRegister'
// import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'
import 'amfe-flexible' // 设置跟标签字体大小，移动端适配

// 封装中间件函数插件
const directiveObj = {
  install (Vue) {
    Vue.directive('autofocus', {
      inserted (el) {
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
          el.focus()
        } else if (el.querySelector('input')) { // 指令所在van-search组件根标签div，input在内部
          setTimeout(() => {
            const theInput = el.querySelector('input')
            if (theInput) theInput.focus()
            const theText = el.querySelector('textarea')
            if (theText) theText.focus()
          }, 0)
        }
      },
      update (el) {
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
          el.focus()
        } else if (el.querySelector('input')) { // 指令所在van-search组件根标签div，input在内部
          setTimeout(() => {
            const theInput = el.querySelector('input')
            if (theInput) theInput.focus()
            const theText = el.querySelector('textarea')
            if (theText) theText.focus()
          }, 0)
        }
      }
    })
  },
  update () {

  }
}
Vue.use(directiveObj)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
