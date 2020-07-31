import {postData,getData} from '../../libs/fetchData'

const namespace = 'api/user/dept';

export default {
  state: {
    userName: '',
    userId: '',
    hasGetInfo: false,
    listData: []
  },
  actions: {
    async getDeptTree({commit}, obj) {
      try {
        let res = await postData(`${namespace}/getDeptTree`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async getDeptList({commit}, obj) {
      try {
        let res = await getData(`${namespace}/getDeptList`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async addDept({commit}, obj) {
      try {
        let res = await postData(`${namespace}/addDept`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async editDept({commit}, obj) {
      try {
        let res = await postData(`${namespace}/updateDept`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async deleteDept({commit}, obj) {
      try {
        let res = await postData(`${namespace}/deleteDept`, obj).catch(err => {
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
