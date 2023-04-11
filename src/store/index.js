import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userphoto: '',
    username: ''
  },
  getters: {
  },
  mutations: {
    SET_USERPHOTO (state, value) {
      state.userphoto = value
    },
    SET_USERNAME (state, value) {
      state.username = value
    }
  },
  actions: {
  },
  modules: {
  }
})
