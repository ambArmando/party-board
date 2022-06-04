import { createStore } from 'vuex'


export default createStore({
  state: {
    players: [],
    currentGameState: {
      players: [{}],
      currentChallange: {
        text: ""
      },
      currentState: '',
      currentPlayerIndex: 0,
      diceValue: 0,
      eliminatedPlayersCount: 0
    },
    //togglePopup: false,
    currentPlayerIndex: 0,
    connectedPlayers: [],
    roomName: '',
    socket: '',
    isMultiplayer: false,
    thisPlayer: {}
  },
  mutations: {
    setPlayers(state, payload){
      state.players = payload;
    },
    setCurrentGameState(state, payload){
      state.currentGameState = payload;
    },
    setThisPlayer(state, payload) {
      state.thisPlayer = {
        id: payload.id,
        name: payload.name,
        color: payload.color,
      }
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
    setIsMultiplayer(state, payload) {
      state.isMultiplayer = payload
    }
  },
  actions: {
    setPlayersArray(context, payload) {
      context.commit('setPlayers', payload);
      console.log("in actions");
    },
    setPlayerPosition(context, args) {
      context.commit('setPlayerPosition', args);
    },
    setCurrentGameState(context, args) {
      context.commit('setCurrentGameState', args);
    },
    setThisPlayer(context, args) {
      context.commit('setThisPlayer', args);
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
    setIsMultiplayer(context, payload) {
      context.commit('setIsMultiplayer', payload);
    }
  },
  modules: {
  },
  getters: {
    getPlayers: state => state.players,
   // getTogglePopup: state => state.togglePopup,
    //getCurrentPlayerIndex: state => state.currentPlayerIndex
    getRoomPlayers: state => state.connectedPlayers,
    getRoomName: state => state.roomName,
    getSocket: state => state.socket,
    getIsMultiplayer: state => state.isMultiplayer,
    getThisPlayer: state => state.thisPlayer,
    getCurrentGameState: state => state.currentGameState
  }
})
