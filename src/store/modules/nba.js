import {postData, getData} from '../../libs/fetchData'

const namespace = 'api/nba/';

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
  },
  mutations: {}
}
