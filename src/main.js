// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {getRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from './utils/util'
import iconPicker from 'vue-fontawesome-elementui-icon-picker';
import ElSelectTree from 'el-select-tree';
import wl from "wl-vue-select";
import "wl-vue-select/lib/wl-vue-select.css"

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(iconPicker);
Vue.use(ElSelectTree);
Vue.use(wl);
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;


router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next();
  } else {
    if (window.localStorage.getItem("user")) {
      initMenu(router, store);
      next();
    } else {
      next('/');
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
