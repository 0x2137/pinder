import { defineStore } from 'pinia'
import api from '../services/api'

export const useMatchStore = defineStore('match', {
  state: () => ({
    matches: [],
  }),
  actions: {
    async fetchMatches() {
      const res = await api.get('/match')
      this.matches = res.data.data.matches
    },
  },
})
