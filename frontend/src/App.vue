<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
    <nav class="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <div class="flex space-x-4">
        <router-link to="/discovery" class="hover:text-pink-400 transition">Discovery</router-link>
        <router-link to="/matches" class="hover:text-pink-400 transition">Matches</router-link>
        <router-link to="/preferences" class="hover:text-pink-400 transition">Preferences</router-link>
        <router-link to="/profile" class="hover:text-pink-400 transition">Profile</router-link>
      </div>
      <div>
        <button @click="logout" class="bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded">Logout</button>
      </div>
    </nav>
    <div class="flex-1 p-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from './stores/auth'

export default {
  setup() {
    const auth = useAuthStore()
    const logout = () => {
      auth.logout()
    }
    return { logout }
  },
}
</script>

<style>
</style>
