<template>
  <div class="max-w-md mx-auto mt-10">
    <div v-if="profile" class="bg-white shadow rounded p-6">
      <h2 class="text-xl font-bold">{{ profile.name }}, {{ profile.age }}</h2>
      <p class="text-gray-600">{{ profile.gender }}</p>
      <p class="mt-2"><strong>City:</strong> {{ profile.city }}</p>
      <p class="mt-2"><strong>About:</strong> {{ profile.about }}</p>
      <p class="mt-2"><strong>Interests:</strong> {{ profile.interests?.join(', ') }}</p>
      <div class="flex space-x-4 mt-4">
        <button @click="like" class="bg-green-500 text-white px-4 py-2 rounded">Like</button>
        <button @click="reject" class="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
      </div>
    </div>
    <div v-else class="text-center mt-10 text-gray-600">No more profiles</div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useDiscoveryStore } from '../stores/discovery'

export default {
  setup() {
    const store = useDiscoveryStore()
    const profile = computed(() => store.currentProfile())

    const loadProfiles = async () => {
      await store.fetchProfiles()
    }

    const like = async () => {
      if (profile.value) {
        await store.like(profile.value._id)
      }
    }
    const reject = async () => {
      if (profile.value) {
        await store.reject(profile.value._id)
      }
    }

    onMounted(loadProfiles)

    return { profile, like, reject }
  },
}
</script>
