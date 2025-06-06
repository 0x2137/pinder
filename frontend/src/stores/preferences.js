import { defineStore } from 'pinia'
import api from '../services/api'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    preferences: null,
  }),
  actions: {
    async fetchPreferences() {
      const res = await api.get('/preferences')
      this.preferences = res.data.data.preferences
    },
    async updatePreferences(data) {
      const res = await api.post('/preferences', data)
      this.preferences = res.data.data.preferences
    },
  },
})
