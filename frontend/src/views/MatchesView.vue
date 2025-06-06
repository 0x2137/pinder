<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-2xl mb-4 font-semibold">Matches</h2>
    <div v-if="matches.length">
      <div v-for="match in matches" :key="match._id" class="bg-gray-800 text-gray-100 shadow-lg rounded-lg p-4 mb-4">
        <img src="https://i.imgur.com/PajiQ14.jpeg" alt="Profile image" class="mx-auto mb-4 w-96 h-96 rounded-lg object-cover" />
        <router-link :to="`/profile/${match._id}`" class="text-xl font-bold hover:text-pink-400 transition">{{ match.name }}</router-link>
        <p>{{ match.age }} years old, {{ match.city }}</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-400">No matches yet</div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useMatchStore } from '../stores/match'

export default {
  setup() {
    const store = useMatchStore()
    const loadMatches = async () => {
      await store.fetchMatches()
    }
    onMounted(loadMatches)
    return { matches: store.matches }
  },
}
</script>
