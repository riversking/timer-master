import {postData} from '../../libs/fetchData'


const namespace = 'api/v1/user/role'

export default {
  state: {},

  actions: {
    async roleList({commit}, obj) {
      try {
        let res = await postData(`${namespace}/roleList`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async addRoleByUserId({commit}, obj) {
      try {
        let res = await postData(`${namespace}/addRoleByUserId`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async getRoleByUserId({commit}, obj) {
      try {
        let res = await postData(`${namespace}/addRoleByUserId`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    }
  },

  mutations: {}
}
