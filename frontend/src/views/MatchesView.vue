<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-2xl mb-4">Matches</h2>
    <div v-if="matches.length">
      <div v-for="match in matches" :key="match._id" class="bg-white shadow rounded p-4 mb-4">
        <router-link :to="`/profile/${match._id}`" class="text-xl font-bold">{{ match.name }}</router-link>
        <p>{{ match.age }} years old, {{ match.city }}</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">No matches yet</div>
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
