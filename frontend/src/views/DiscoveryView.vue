<template>
  <div class="max-w-md mx-auto mt-10">
    <div v-if="profiles.length">
      <div
          v-for="p in profiles"
          :key="p._id"
          class="bg-gray-800 text-gray-100 shadow-lg rounded-lg p-6 mb-4"
      >
        <img
            src="https://i.imgur.com/PajiQ14.jpeg"
            alt="Profile image"
            class="mx-auto mb-4 w-96 h-96 rounded-lg object-cover"
        />
        <h2 class="text-xl font-bold">{{ p.name }}, {{ p.age }}</h2>
        <p class="text-gray-400">{{ p.gender }}</p>
        <p class="mt-2"><strong>City:</strong> {{ p.city }}</p>
        <p class="mt-2"><strong>About:</strong> {{ p.about }}</p>
        <p class="mt-2"><strong>Interests:</strong> {{ p.interests?.join(', ') }}</p>
        <div class="flex space-x-4 mt-4">
          <button @click="like(p._id)" class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded">Like</button>
          <button @click="reject(p._id)" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">Reject</button>
        </div>
      </div>
    </div>
    <div v-else class="text-center mt-10 text-gray-400">No more profiles</div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useDiscoveryStore } from '../stores/discovery'

export default {
  setup() {
    const store = useDiscoveryStore()

    const loadProfiles = async () => {
      await store.fetchProfiles()
    }

    const like = async (id) => {
      await store.like(id)
    }
    const reject = async (id) => {
      await store.reject(id)
    }

    onMounted(loadProfiles)

    return { profiles: store.profiles, like, reject }
  },
}
</script>
