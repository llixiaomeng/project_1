import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible' // 设置跟标签字体大小，移动端适配
import { Field, Button, Form, NavBar, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh, ActionSheet, Popup, Grid, GridItem, Row, Badge, Col, Search, Divider, Image as VanImage, Tag, CellGroup, Dialog, DatetimePicker } from 'vant'

Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(CellGroup)
Vue.use(Tag)
Vue.use(VanImage)
Vue.use(Divider)
Vue.use(Search)
Vue.use(Row)
Vue.use(Badge)
Vue.use(Col)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Cell)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(NavBar)
Vue.use(Form)
Vue.use(Field)
Vue.use(Button)

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
