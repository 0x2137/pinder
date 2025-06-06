<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-gray-100 shadow-lg rounded-lg">
    <h2 class="text-2xl mb-4 text-center font-semibold">Register</h2>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block">Email</label>
        <input v-model="email" type="email" required class="w-full bg-gray-700 border border-gray-600 p-2 rounded" />
      </div>
      <div>
        <label class="block">Password</label>
        <input v-model="password" type="password" required class="w-full bg-gray-700 border border-gray-600 p-2 rounded" />
      </div>
      <button type="submit" class="w-full bg-pink-600 hover:bg-pink-700 text-white p-2 rounded">Register</button>
    </form>
    <p class="mt-4 text-center">
      Already have an account?
      <router-link to="/login" class="text-pink-500 hover:underline">Login</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const auth = useAuthStore()
    const router = useRouter()

    const onSubmit = async () => {
      try {
        await auth.register(email.value, password.value)
        router.push('/discovery')
      } catch (err) {
        alert(err.response?.data?.message || 'Registration failed')
      }
    }

    return { email, password, onSubmit }
  },
}
</script>
