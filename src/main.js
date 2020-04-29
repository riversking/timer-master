// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import iconPicker from 'vue-fontawesome-elementui-icon-picker';
import ElSelectTree from 'el-select-tree';
import wl from "wl-vue-select";
import "wl-vue-select/lib/wl-vue-select.css"
import AFTableColumn from 'af-table-column'
import ExTableColumn from 'ex-table-column';
import {getRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from './utils/util'
import App from './App'
import store from './store'
import router from './router'

const fontRate = {
  CHAR_RATE: 1.1, // 汉字比率
  NUM_RATE: 0.65, // 数字
  OTHER_RATE: 0.8 // 除汉字和数字以外的字符的比率
}
const fontSize = 16

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(iconPicker);
Vue.use(ElSelectTree);
Vue.use(AFTableColumn, {fontRate, fontSize})
Vue.use(wl);
Vue.component(ExTableColumn.name, ExTableColumn);
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
