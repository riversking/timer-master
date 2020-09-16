import Cookies from 'js-cookie'
import {Message} from 'element-ui';
import Router from "vue-router";


export const TOKEN_KEY = 'token';


export const initMenu = (router, store) => {
  if (store.state.routes.length > 0) {
    return;
  }
  store.dispatch('menuByUserId').then(res => {
    if (res) {
      if (res.code === '0') {
        const fmtRoutes = formatRoutes(res.data);
        router.matcher = new Router().matcher;
        router.addRoutes(fmtRoutes);
        store.commit('initMenu', fmtRoutes);
        // store.dispatch('connect');
      } else {
        Message.error(res.message)
        router.replace('/login')
      }
    } else {
      router.replace('/login')
    }
  });
};

export const formatRoutes = (routes) => {
  let fmRoutes = [];
  if (null != routes) {
    routes.forEach(router => {
      let {
        path,
        component,
        name,
        meta,
        icon,
        children
      } = router;
      if (children !== null && children instanceof Array) {
        children = formatRoutes(children);
      }
      let fmRouter = {
        path: path,
        name: name,
        icon: icon,
        meta: meta,
        children: children,
        component(resolve) {
          require(['../components/' + component + '.vue'], resolve);
        }
      };
      fmRoutes.push(fmRouter);
    });
  }
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

/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
  delete obj1.close
  var o1 = obj1 instanceof Object
  var o2 = obj2 instanceof Object
  if (!o1 || !o2) { /*  判断不是对象  */
    return obj1 === obj2
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
    // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  }

  for (const attr in obj1) {
    const t1 = obj1[attr] instanceof Object;
    const t2 = obj2[attr] instanceof Object
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr])
    } else if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}
