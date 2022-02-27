import { createStore } from 'vuex'

export default createStore({
  state: {
    players: []
  },
  mutations: {
    setPlayers(state, payload){
      state.players = payload;
    }
  },
  actions: {
    setPlayersArray(context, payload) {
      context.commit('setPlayers', payload);
      console.log("in actions");
    }
  },
  modules: {
  },
  getters: {
    getPlayers: state => state.players
  }
})
