import {postData, getData} from '../../libs/fetchData'

const namespace = 'api/nba';

export default {
  state: {
    userName: '',
    userId: '',
    hasGetInfo: false,
    listData: []
  },
  actions: {
    async getPlayerList({commit}, obj) {
      try {
        let res = await postData(`${namespace}/player/playerList`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async syncPlayer({commit}, obj) {
      try {
        let res = await postData(`${namespace}/player/syncPlayer`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async getTeamList({commit}, obj) {
      try {
        let res = await postData(`${namespace}/team/getTeamList`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async getTeamPage({commit}, obj) {
      try {
        let res = await postData(`${namespace}/team/getTeamPage`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async getPlayerDetail({commit}, obj) {
      try {
        let res = await postData(`${namespace}/player/getPlayerDetail`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async getStadiumPage({commit}, obj) {
      try {
        let res = await postData(`${namespace}/stadium/getStadiumPage`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async getTeamDetail({commit}, obj) {
      try {
        let res = await postData(`${namespace}/team/getTeamDetail`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async stadiumList({commit}, obj) {
      try {
        let res = await postData(`${namespace}/stadium/stadiumList`, obj).catch(err => {
          commit('GLOBAL_ERR', err, {root: true})
        });
        return res.data
      } catch (error) {
        console.log('error: ', error)
      }
    },

  },
  mutations: {}
}
