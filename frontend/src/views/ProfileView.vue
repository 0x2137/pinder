<template>
  <div class="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded">
    <h2 class="text-2xl mb-4">My Profile</h2>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block">Name</label>
        <input v-model="form.name" type="text" required class="w-full border p-2 rounded" />
      </div>
      <div>
        <label class="block">Age</label>
        <input v-model.number="form.age" type="number" min="18" required class="w-full border p-2 rounded" />
      </div>
      <div>
        <label class="block">Gender</label>
        <select v-model="form.gender" required class="w-full border p-2 rounded">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="nonbinary">Nonbinary</option>
        </select>
      </div>
      <div>
        <label class="block">City</label>
        <input v-model="form.city" type="text" class="w-full border p-2 rounded" />
      </div>
      <div>
        <label class="block">About</label>
        <textarea v-model="form.about" class="w-full border p-2 rounded"></textarea>
      </div>
      <div>
        <label class="block">Children</label>
        <select v-model="form.children" class="w-full border p-2 rounded">
          <option value="doesnt_want">Doesn't want</option>
          <option value="want">Want</option>
          <option value="has">Has</option>
          <option value="maybe">Maybe</option>
        </select>
      </div>
      <div>
        <label class="block">Education</label>
        <select v-model="form.education" class="w-full border p-2 rounded">
          <option value="HS">HS</option>
          <option value="BS">BS</option>
          <option value="MS">MS</option>
          <option value="PhD">PhD</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label class="block">Interests (comma-separated)</label>
        <input v-model="interestsText" type="text" class="w-full border p-2 rounded" />
      </div>
      <div>
        <label class="block">Height (cm)</label>
        <input v-model.number="form.height" type="number" min="120" max="250" class="w-full border p-2 rounded" />
      </div>
      <div>
        <label class="block">Body Type</label>
        <select v-model="form.bodyType" class="w-full border p-2 rounded">
          <option value="slim">Slim</option>
          <option value="average">Average</option>
          <option value="athletic">Athletic</option>
          <option value="curvy">Curvy</option>
          <option value="fat">Fat</option>
          <option value="other">Other</option>
        </select>
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Save Profile</button>
    </form>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { useProfileStore } from '../stores/profile'

export default {
  setup() {
    const store = useProfileStore()
    const form = reactive({
      name: '',
      age: 18,
      gender: 'female',
      city: '',
      about: '',
      children: 'doesnt_want',
      education: 'HS',
      interests: [],
      height: 120,
      bodyType: 'slim',
    })
    const interestsText = ref('')

    const loadProfile = async () => {
      await store.fetchProfile()
      if (store.profile) {
        Object.assign(form, { ...store.profile })
        interestsText.value = (store.profile.interests || []).join(',')
      }
    }
    onMounted(loadProfile)

    const onSubmit = async () => {
      form.interests = interestsText.value
        .split(',')
        .map(s => s.trim())
        .filter(s => s)
      try {
        await store.updateProfile(form)
        alert('Profile updated')
      } catch (err) {
        alert(err.response?.data?.message || 'Update failed')
      }
    }

    return { form, interestsText, onSubmit }
  },
}
</script>
