import {postData} from '../../libs/fetchData'

const namespace = '/user/menu';

export default {
  state: {
    userName: '',
    userId: '',
    hasGetInfo: false,
    listData: []
  },
  actions: {
    async menuByUserId({commit}, obj) {
      try {
        let res = await postData(`${namespace}/getMenuByUserId`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });

        if (res.status === 200) {
          // setToken(res.data.datas.accessToken)
          // commit('SET_ACCESS_TOKEN', res.data.datas.accessTokenToken)
          // commit('SET_REFRESH_TOKEN', res.data.datas.refresh_token)
        }
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
  },
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
    },
    ['SET_REFRESH_TOKEN'](state, rfToken) {
      state.refresh_token = rfToken
      setStore({
        name: 'refresh_token',
        content: state.refresh_token,
        type: 'session'
      })
    },
    ['USER_INFO'](state, payload) {
      console.log('payload.datas.avatar', payload.datas.avatar)
      state.avatorImgPath = payload.datas.avatar
    }
  }
}
