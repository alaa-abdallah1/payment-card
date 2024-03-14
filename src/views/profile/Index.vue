<template>
  <div class="flex flex-col space-y-8">
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold">Profile</h1>
      <div class="flex items-center gap-4">
        <Button
          v-if="isEditable"
          text="Cancel"
          type="white"
          :isDisabled="isDisabled"
          @click="isEditable = false"
        />

        <Button
          :text="isEditable ? 'Save' : 'Edit'"
          :isDisabled="isDisabled || hasErrors"
          @click="onEditSaveClick"
        />
      </div>
    </div>
    <div class="bg-white shadow-md rounded-lg">
      <dl class="grid grid-cols-1 sm:grid-cols-2">
        <div
          v-for="(field, index) in fields"
          :key="index"
          class="flex flex-col space-y-2 sm:shadow-sm p-4"
        >
          <dt class="text-gray-600 font-bold capitalize">
            {{ field.label || field.name }}:
          </dt>
          <template v-if="!isEditable">
            <span
              v-if="isLoading"
              class="animate-pulse h-6 bg-slate-100 w-full"
            ></span>
            <dd v-else class="text-gray-800 capitalize truncate">
              {{ field.value || '-' }}
            </dd>
          </template>
          <template v-else>
            <TextField
              v-if="field.name === 'name'"
              type="text"
              :maxlength="35"
              isRequired
              v-model="editableUser.name"
              @validation:error="validationErrors.name = $event"
            />
            <TextField
              v-if="field.name === 'age'"
              type="number"
              isRequired
              :max="65"
              :min="18"
              :maxlength="2"
              v-model="editableUser.age"
              inputRestriction="numberOnly"
              @validation:error="validationErrors.age = $event"
            />
            <SelectField
              v-if="field.name === 'gender'"
              placeholder="Select Gender"
              :options="{ male: 'Male', female: 'Female' }"
              v-model="editableUser.gender"
            />
            <input
              v-if="field.name === 'birthdate'"
              type="date"
              class="input-field"
              :min="minDate"
              :max="today"
              v-model="editableUser.birthdate"
            />
          </template>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { getUser, updateUser } from '@/services'
import Button from '@/components/atoms/Button.vue'
import TextField from '@/components/atoms/TextField.vue'
import SelectField from '@/components/atoms/SelectField.vue'
import { User } from '@/types'

const userId = '1' // Assume we're working with user 1
const minDate = '1930-01-01' // Setting min date as January 1, 1930
const today = new Date().toISOString().split('T')[0] // Today's date in "YYYY-MM-DD" format

const isSaving = ref<boolean>(false)
const isLoading = ref<boolean>(true)
const isEditable = ref<boolean>(false)
const hasErrors = ref<boolean>(false)
const profile = ref<User | null>(null)
const validationErrors = ref<{ [key: string]: string }>({})
const editableUser = reactive<User>({ ...(profile.value as User) })

const fields = computed(() => [
  { name: 'name', value: profile.value?.name },
  { name: 'gender', value: profile.value?.gender },
  { name: 'age', value: profile.value?.age },
  {
    name: 'birthdate',
    label: 'Birth Date',
    value: profile.value?.birthdate,
  },
])

const isDisabled = computed(() => isLoading.value || isSaving.value)

watch(
  () => editableUser,
  () =>
    (hasErrors.value = Object.values(validationErrors.value).some(
      (value) => value,
    )),
  { deep: true },
)

const formatDate = (value: string | Date) =>
  new Date(value as string)?.toISOString()?.split('T')[0] || '-'

const onEditSaveClick = async () => {
  if (isEditable.value) {
    if (!hasErrors.value) {
      isSaving.value = true
      try {
        const updatedUser = await updateUser(userId, editableUser as User)
        profile.value = {
          ...updatedUser,
          birthdate: formatDate(updatedUser.birthdate),
        }
        isEditable.value = false
      } catch (error) {
        alert('Failed to update user')
      } finally {
        isSaving.value = false
      }
    }
  } else {
    isEditable.value = true
  }
}

onMounted(async () => {
  isLoading.value = true

  const getUserResponse = await getUser(userId)

  profile.value = {
    ...getUserResponse,
    birthdate: formatDate(getUserResponse?.birthdate as string),
  }

  editableUser.age = profile.value?.age
  editableUser.name = profile.value?.name
  editableUser.gender = profile.value?.gender
  editableUser.birthdate = profile.value?.birthdate

  isLoading.value = false
})
</script>
