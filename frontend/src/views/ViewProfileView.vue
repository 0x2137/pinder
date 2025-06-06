<template>
  <div class="max-w-md mx-auto mt-10 bg-gray-800 text-gray-100 shadow-lg rounded-lg p-6">
    <img src="https://i.imgur.com/PajiQ14.jpeg" alt="Profile image" class="mx-auto mb-4 w-32 h-32 rounded-full object-cover" />
    <h2 class="text-xl font-bold">{{ profile.name }}, {{ profile.age }}</h2>
    <p class="text-gray-400">{{ profile.gender }}</p>
    <p class="mt-2"><strong>City:</strong> {{ profile.city }}</p>
    <p class="mt-2"><strong>About:</strong> {{ profile.about }}</p>
    <p class="mt-2"><strong>Interests:</strong> {{ profile.interests?.join(', ') }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProfileStore } from '../stores/profile'

export default {
  setup() {
    const route = useRoute()
    const store = useProfileStore()
    const profile = ref(null)

    const loadProfile = async () => {
      const data = await store.fetchOtherProfile(route.params.id)
      profile.value = data
    }
    onMounted(loadProfile)

    return { profile }
  },
}
</script>
