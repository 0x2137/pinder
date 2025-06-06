import { defineStore } from 'pinia'
import api from '../services/api'

export const useDiscoveryStore = defineStore('discovery', {
  state: () => ({
    profiles: [],
    index: 0,
  }),
  actions: {
    async fetchProfiles() {
      const res = await api.get('/discovery/near')
      this.profiles = res.data.data.profiles
      this.index = 0
    },
    next() {
      if (this.index < this.profiles.length - 1) {
        this.index++
      }
    },
    currentProfile() {
      return this.profiles[this.index]
    },
    async like(id) {
      await api.post('/match/like', { candidateId: id })
      this.next()
    },
    async reject(id) {
      await api.post('/match/reject', { candidateId: id })
      this.next()
    },
  },
})
