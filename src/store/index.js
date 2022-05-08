import { createStore } from 'vuex'

export default createStore({
  state: {
    players: [],
    //togglePopup: false,
    currentPlayerIndex: 0,
    connectedPlayers: [],
    roomName: '',
    socket: ''
  },
  mutations: {
    setPlayers(state, payload){
      state.players = payload;
    },
    setPlayerPosition(state, payload) {
      for (let player of state.players) {
        if (player.id === payload.player.id) {
          player.lastI = player.i;
          player.lastJ = player.j;
          player.i = payload.i;
          player.j = payload.j;
        }
      }
    },
    // togglePopup(state, payload) {
    //   state.togglePopup = payload;
    // },
    setCurrentPlayerIndex(state, payload) {
      state.currentPlayerIndex = payload;
    },
    setConnectedPlayers(state, payload) {
      state.connectedPlayers = payload;
    },
    setRoom(state, payload) {
      state.roomName = payload;
    },
    setSocket(state, payload) {
      state.socket = payload;
    },
  },
  actions: {
    setPlayersArray(context, payload) {
      context.commit('setPlayers', payload);
      console.log("in actions");
    },
    setPlayerPosition(context, args) {
      context.commit('setPlayerPosition', args);
    },
    // togglePopup(context, payload) {
    //   context.commit('togglePopup', payload);
    // },
    setCurrentPlayerIndex(context, payload) {
      context.commit('setCurrentPlayerIndex', payload);
    },
    setConnectedPlayers(context, payload) {
      context.commit('setConnectedPlayers', payload);
    },
    setRoom(context, payload) {
      context.commit('setRoom', payload);
    },
    setSocket(context, payload) {
      context.commit('setSocket', payload);
    },
  },
  modules: {
  },
  getters: {
    getPlayers: state => state.players,
   // getTogglePopup: state => state.togglePopup,
    //getCurrentPlayerIndex: state => state.currentPlayerIndex
    getRoomPlayers: state => state.connectedPlayers,
    getRoomName: state => state.roomName,
    getSocket: state => state.socket
  }
})
