<template>
  <div class="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded">
    <h2 class="text-2xl mb-4">Preferences</h2>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div class="flex space-x-2">
        <div class="w-1/2">
          <label class="block">Age Min</label>
          <input v-model.number="form.agePref.min" type="number" min="18" class="w-full border p-2 rounded" />
        </div>
        <div class="w-1/2">
          <label class="block">Age Max</label>
          <input v-model.number="form.agePref.max" type="number" min="18" class="w-full border p-2 rounded" />
        </div>
      </div>
      <div>
        <label class="block">Gender Preference</label>
        <select v-model="form.genderPref" class="w-full border p-2 rounded">
          <option value="any">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="nonbinary">Nonbinary</option>
        </select>
      </div>
      <div>
        <label class="block">Children Preference</label>
        <select v-model="form.childrenPref" class="w-full border p-2 rounded">
          <option value="any">Any</option>
          <option value="doesnt_want">Doesn't want</option>
          <option value="want">Want</option>
          <option value="has">Has</option>
          <option value="maybe">Maybe</option>
        </select>
      </div>
      <div>
        <label class="block">Education Preference</label>
        <select v-model="form.educationPref" class="w-full border p-2 rounded">
          <option value="any">Any</option>
          <option value="HS">HS</option>
          <option value="BS">BS</option>
          <option value="MS">MS</option>
          <option value="PhD">PhD</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label class="block">Body Type Preference</label>
        <select v-model="form.bodyTypePref" class="w-full border p-2 rounded">
          <option value="any">Any</option>
          <option value="slim">Slim</option>
          <option value="average">Average</option>
          <option value="athletic">Athletic</option>
          <option value="curvy">Curvy</option>
          <option value="fat">Fat</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label class="block">Range (km)</label>
        <input v-model.number="form.rangePref" type="number" min="10" max="1000" class="w-full border p-2 rounded" />
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Save Preferences</button>
    </form>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { usePreferencesStore } from '../stores/preferences'

export default {
  setup() {
    const store = usePreferencesStore()
    const form = reactive({
      agePref: { min: 18, max: 99 },
      genderPref: 'any',
      childrenPref: 'any',
      educationPref: 'any',
      bodyTypePref: 'any',
      rangePref: 50,
    })

    const loadPreferences = async () => {
      try {
        await store.fetchPreferences()
        if (store.preferences) {
          Object.assign(form, { ...store.preferences })
        }
      } catch (err) {
      }
    }
    onMounted(loadPreferences)

    const onSubmit = async () => {
      try {
        await store.updatePreferences(form)
        alert('Preferences updated')
      } catch (err) {
        alert(err.response?.data?.message || 'Update failed')
      }
    }

    return { form, onSubmit }
  },
}
</script>
