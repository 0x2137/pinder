<template>
  <div>
    <nav class="bg-gray-800 text-white p-4 flex justify-between">
      <div class="flex space-x-4">
        <router-link to="/discovery" class="hover:underline">Discovery</router-link>
        <router-link to="/matches" class="hover:underline">Matches</router-link>
        <router-link to="/preferences" class="hover:underline">Preferences</router-link>
        <router-link to="/profile" class="hover:underline">Profile</router-link>
      </div>
      <div>
        <button @click="logout" class="bg-red-500 px-2 py-1 rounded">Logout</button>
      </div>
    </nav>
    <router-view />
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
