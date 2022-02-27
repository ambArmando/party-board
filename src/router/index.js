import { createRouter, createWebHistory } from 'vue-router'
import MainMenu from '../components/MainMenu.vue'
import BoardUI from '../components/BoardUI.vue'
import BoardUIGrid from '../components/BoardUIGrid.vue'

const routes = [
  {
    path: '/',
    name: 'MainMenu',
    component: MainMenu
  },
  {
    path: '/board',
    name: 'BoardUI',
    component: BoardUI
  },
  {
    path: '/test',
    name: 'BoardUIGrid',
    component: BoardUIGrid
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
