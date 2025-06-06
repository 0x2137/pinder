import { defineStore } from 'pinia'
import api from '../services/api'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
  }),
  actions: {
    async fetchProfile() {
      const res = await api.get('/profiles/me')
      this.profile = res.data.data.profile
    },
    async updateProfile(data) {
      const res = await api.put('/profiles/me', data)
      this.profile = res.data.data.profile
    },
    async fetchOtherProfile(id) {
      const res = await api.get(`/profiles/${id}`)
      return res.data.data.profile
    },
  },
})
