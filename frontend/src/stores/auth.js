import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || '',
    user: null,
  }),
  getters: {
    isAuthenticated: state => !!state.accessToken,
  },
  actions: {
    async login(email, password) {
      const res = await api.post('/auth/login', { email, password })
      this.accessToken = res.data.data.accessToken
      localStorage.setItem('accessToken', this.accessToken)
      await this.fetchUser()
    },
    async register(email, password) {
      const res = await api.post('/auth/register', { email, password })
      this.accessToken = res.data.data.accessToken
      localStorage.setItem('accessToken', this.accessToken)
      await this.fetchUser()
    },
    async logout() {
      await api.post('/auth/logout')
      this.accessToken = ''
      localStorage.removeItem('accessToken')
      this.user = null
      window.location.href = '/login'
    },
    async fetchUser() {
      try {
        const res = await api.get('/profiles/me')
        this.user = res.data.data.profile
      } catch (err) {
        console.error(err)
      }
    },
  },
})
