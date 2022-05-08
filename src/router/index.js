import { createRouter, createWebHistory } from 'vue-router'
import MainMenu from '../components/MainMenu.vue'
import BoardUIGrid from '../components/BoardUIGrid.vue'
import Multiplayer from '../components/Multiplayer.vue'
import MultiplayerLobby from '../components/MultiplayerLobby.vue'

const routes = [
  {
    path: '/',
    name: 'MainMenu',
    component: MainMenu
  },
  {
    path: '/board',
    name: 'BoardUIGrid',
    component: BoardUIGrid
  },
  {
    path: '/multiplayer',
    name: 'Multiplayer',
    component: Multiplayer
  },
  {
    path: '/multiplayerLobby',
    name: 'multiplayerLobby',
    component: MultiplayerLobby
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
