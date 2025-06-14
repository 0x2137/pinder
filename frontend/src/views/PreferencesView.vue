<template>
  <div class="max-w-lg mx-auto mt-10 p-6 bg-gray-800 text-gray-100 shadow-lg rounded-lg">
    <h2 class="text-2xl mb-4 font-semibold">Preferences</h2>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div class="flex space-x-2">
        <div class="w-1/2">
          <label class="block">Age Min</label>
          <input v-model.number="form.agePref.min" type="number" min="18" class="w-full bg-gray-700 border border-gray-600 p-2 rounded" />
        </div>
        <div class="w-1/2">
          <label class="block">Age Max</label>
          <input v-model.number="form.agePref.max" type="number" min="18" class="w-full bg-gray-700 border border-gray-600 p-2 rounded" />
        </div>
      </div>
      <div>
        <label class="block mb-1">Gender Preference</label>
        <div class="flex flex-wrap gap-2 items-center">
          <label v-for="opt in genderOptions" :key="opt" class="inline-flex items-center">
            <input type="checkbox" v-model="form.genderPref" :value="opt" class="mr-1" />
            {{ opt }}
          </label>
          <button type="button" @click="toggleAllGender" class="text-sm underline ml-2">
            {{ allGenderSelected ? 'Unselect all' : 'Select all' }}
          </button>
        </div>
      </div>
      <div>
        <label class="block mb-1">Children Preference</label>
        <div class="flex flex-wrap gap-2 items-center">
          <label v-for="opt in childrenOptions" :key="opt" class="inline-flex items-center">
            <input type="checkbox" v-model="form.havingChildrenPref" :value="opt" class="mr-1" />
            {{ opt }}
          </label>
          <button type="button" @click="toggleAllChildren" class="text-sm underline ml-2">
            {{ allChildrenSelected ? 'Unselect all' : 'Select all' }}
          </button>
        </div>
      </div>
      <div>
        <label class="block mb-1">Education Preference</label>
        <div class="flex flex-wrap gap-2 items-center">
          <label v-for="opt in educationOptions" :key="opt" class="inline-flex items-center">
            <input type="checkbox" v-model="form.educationPref" :value="opt" class="mr-1" />
            {{ opt }}
          </label>
          <button type="button" @click="toggleAllEducation" class="text-sm underline ml-2">
            {{ allEducationSelected ? 'Unselect all' : 'Select all' }}
          </button>
        </div>
      </div>
      <div>
        <label class="block mb-1">Body Type Preference</label>
        <div class="flex flex-wrap gap-2 items-center">
          <label v-for="opt in bodyTypeOptions" :key="opt" class="inline-flex items-center">
            <input type="checkbox" v-model="form.bodyTypePref" :value="opt" class="mr-1" />
            {{ opt }}
          </label>
          <button type="button" @click="toggleAllBody" class="text-sm underline ml-2">
            {{ allBodySelected ? 'Unselect all' : 'Select all' }}
          </button>
        </div>
      </div>
      <div>
        <label class="block">Range (km)</label>
        <input v-model.number="form.rangePref" type="number" min="10" max="1000" class="w-full bg-gray-700 border border-gray-600 p-2 rounded" />
      </div>
      <button type="submit" class="w-full bg-pink-600 hover:bg-pink-700 text-white p-2 rounded">Save Preferences</button>
    </form>
  </div>
</template>

<script>
import { reactive, onMounted, computed } from 'vue'
import { usePreferencesStore } from '../stores/preferences'

export default {
  setup() {
    const store = usePreferencesStore()
    const genderOptions = ['male', 'female', 'nonbinary']
    const childrenOptions = ['doesnt_want', 'want', 'has', 'maybe']
    const educationOptions = ['HS', 'BS', 'MS', 'PhD', 'Other']
    const bodyTypeOptions = ['slim', 'average', 'athletic', 'curvy', 'fat', 'other']

    const form = reactive({
      agePref: { min: 18, max: 99 },
      genderPref: [...genderOptions],
      havingChildrenPref: [...childrenOptions],
      educationPref: [...educationOptions],
      bodyTypePref: [...bodyTypeOptions],
      rangePref: 50,
    })

    const allGenderSelected = computed(() => genderOptions.every(o => form.genderPref.includes(o)))
    const toggleAllGender = () => {
      form.genderPref = allGenderSelected.value ? [] : [...genderOptions]
    }

    const allChildrenSelected = computed(() => childrenOptions.every(o => form.havingChildrenPref.includes(o)))
    const toggleAllChildren = () => {
      form.havingChildrenPref = allChildrenSelected.value ? [] : [...childrenOptions]
    }

    const allEducationSelected = computed(() => educationOptions.every(o => form.educationPref.includes(o)))
    const toggleAllEducation = () => {
      form.educationPref = allEducationSelected.value ? [] : [...educationOptions]
    }

    const allBodySelected = computed(() => bodyTypeOptions.every(o => form.bodyTypePref.includes(o)))
    const toggleAllBody = () => {
      form.bodyTypePref = allBodySelected.value ? [] : [...bodyTypeOptions]
    }

    const loadPreferences = async () => {
      try {
        await store.fetchPreferences()
        if (store.preferences) {
          Object.assign(form, { ...store.preferences })
        }
      } catch (err) {
        console.error(err)
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

    return {
      form,
      genderOptions,
      childrenOptions,
      educationOptions,
      bodyTypeOptions,
      allGenderSelected,
      allChildrenSelected,
      allEducationSelected,
      allBodySelected,
      toggleAllGender,
      toggleAllChildren,
      toggleAllEducation,
      toggleAllBody,
      onSubmit,
    }
  },
}
</script>
