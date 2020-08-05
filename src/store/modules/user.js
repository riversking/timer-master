import {getData, postData} from '../../libs/fetchData'
import {setToken} from '../../utils/util'


const namespace = 'api/user'

export default {
  state: {
    userName: '',
    userId: '',
    avator: '',
    hasGetInfo: false,
    listData: []
  },
  actions: {
    // 登录
    async userLogin({commit}, obj) {
      try {
        let res = await postData(`${namespace}/login`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        console.log('resresresres', res.data.data.accessToken)
        if (res.status === 200) {
          setToken(res.data.data.accessToken)
          // commit('SET_ACCESS_TOKEN', res.data.datas.accessTokenToken)
          // commit('SET_REFRESH_TOKEN', res.data.datas.refresh_token)
        }
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async userPage({commit}, obj) {
      try {
        let res = await postData(`${namespace}/userPage`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        if (res.status === 200) {
          // setToken(res.data.data.accessToken)
          // commit('SET_ACCESS_TOKEN', res.data.datas.accessTokenToken)
          // commit('SET_REFRESH_TOKEN', res.data.datas.refresh_token)
        }
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async addUser({commit}, obj) {
      try {
        let res = await postData(`${namespace}/addUser`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        if (res.status === 200) {

        }
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async isDisable({commit}, obj) {
      try {
        let res = await postData(`${namespace}/isDisable`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async deleteUser({commit}, obj) {
      try {
        let res = await postData(`${namespace}/deleteUser`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async getUserById({commit}, obj) {
      try {
        let res = await postData(`${namespace}/getUserById`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async updateUserById({commit}, obj) {
      try {
        let res = await postData(`${namespace}/updateUserById`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async importUserByExcel({commit}, obj) {
      try {
        let res = await postData(`${namespace}/importUserExcel`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async changePassword({commit}, obj) {
      try {
        let res = await postData(`${namespace}/changePassword`, obj).catch(err => {
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
