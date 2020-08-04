import {getData, postData} from "../../libs/fetchData";

const namespace = 'api/file'

export default {
  state: {
    userName: '',
    userId: '',
    avator: '',
    hasGetInfo: false,
    listData: []
  },
  actions: {
    async exportUser({commit}, obj) {
      try {
        let res = await getData(`${namespace}/exportUser`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    }
  }
  ,
  mutations: {
    ['SET_ACCESS_TOKEN'](state, access_token) {
      console.log('access_token', access_token)
      console.log('state', state.access_token)
      // state.access_token = access_token
      setStore({
        name: 'access_token',
        content: state.access_token,
        type: 'session'
      })
    }
    ,
    ['SET_REFRESH_TOKEN'](state, rfToken) {
      state.refresh_token = rfToken
      setStore({
        name: 'refresh_token',
        content: state.refresh_token,
        type: 'session'
      })
    }
    ,
    ['USER_INFO'](state, payload) {
      console.log('payload.datas.avatar', payload.datas.avatar)
      state.avatorImgPath = payload.datas.avatar
    }
  }
}