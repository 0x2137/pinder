<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
    <h2 class="text-2xl mb-4">Login</h2>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block">Email</label>
        <input v-model="email" type="email" required class="w-full border p-2 rounded" />
      </div>
      <div>
        <label class="block">Password</label>
        <input v-model="password" type="password" required class="w-full border p-2 rounded" />
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Login</button>
    </form>
    <p class="mt-4 text-center">
      Don't have an account?
      <router-link to="/register" class="text-blue-500">Register</router-link>
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
        await auth.login(email.value, password.value)
        router.push('/discovery')
      } catch (err) {
        alert(err.response?.data?.message || 'Login failed')
      }
    }

    return { email, password, onSubmit }
  },
}
</script>
