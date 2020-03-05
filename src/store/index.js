import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import menu from './modules/menu'
import {instance} from '../libs/fetchData'
import {getToken} from '../utils/util'


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: JSON.parse(window.localStorage.getItem('user')),
    routes: []
  },
  mutations: {
    initMenu(state, menus) {
      state.routes = menus
      window.localStorage.setItem('menu', JSON.stringify(menus));
    },
    login(state, user) {
      state.userInfo = user;
    }
  },
  actions: {},
  modules: {
    user,
    menu
  }
});

instance.interceptors.request.use(config => {
  console.log('我是拦截器')
  console.log('getToken()getToken()getToken()', getToken())
  if (getToken()) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  return Promise.reject(error)
})

export default store
