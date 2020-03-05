import Cookies from 'js-cookie'
import {Message} from 'element-ui';
import Router from "vue-router";


export const TOKEN_KEY = 'token';


export const initMenu = (router, store) => {
  if (store.state.routes.length > 0) {
    return;
  }
  const userId = store.state.userInfo.id;
  store.dispatch('menuByUserId', {
    'param': userId
  }).then(res => {
    if (res.code === '0') {
      const fmtRoutes = formatRoutes(res.data);
      router.matcher = new Router().matcher;
      router.addRoutes(fmtRoutes);
      store.commit('initMenu', fmtRoutes);
      // store.dispatch('connect');
    } else {
      Message.error(res.message)
    }
  });
};

export const formatRoutes = (routes) => {
  let fmRoutes = [];
  routes.forEach(router => {
    let {
      path,
      component,
      name,
      meta,
      iconCls,
      children
    } = router;
    if (children.length > 0 && children instanceof Array) {
      children = formatRoutes(children);
    }
    let fmRouter = {
      path: path,
      name: name,
      iconCls: iconCls,
      meta: meta,
      children: children,
      component(resolve) {
        if (component.startsWith("Home")) {
          require(['../components/' + component + '.vue'], resolve);
        } else if (component.startsWith("User")) {
          require(['../components/user/' + component + '.vue'], resolve);
        } else if (component.startsWith("Per")) {
          require(['@/components/menu/' + component + '.vue'], resolve);
        }
      }
    };
    fmRoutes.push(fmRouter);
  });
  return fmRoutes;
};


export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, {expires: 1})
};

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) return token;
  else return false
};
