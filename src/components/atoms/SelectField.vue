<template>
  <div :class="['flex relative flex-col gap-1 w-full mb-6', containerClass]">
    <div>
      <label v-if="label" :for="id" :class="['input-label', labelClass]">
        {{ label }}
      </label>

      <select
        :id="id"
        data-card-field
        ref="selectInputRef"
        :value="modelValue"
        :class="[
          'input-field appearance-none',
          inputClass,
          {
            'border-red-500': errorMessage,
          },
        ]"
        @input="updateValue"
        @blur="onBlur"
        @focus="onFocus"
      >
        <option value selected>
          {{ placeholder || 'Select' }}
        </option>
        <option
          v-for="(option, index) in computedOptions"
          :key="index"
          :value="option.value"
          :disabled="option?.disabled"
        >
          {{ option.text }}
        </option>
      </select>
    </div>

    <span
      v-if="errorMessage"
      class="text-red-500 text-sm mt-1 absolute -bottom-6"
    >
      {{ errorMessage }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { SelectFieldProps } from '@/types'
import { defineProps, computed, ref } from 'vue'

const props = defineProps<SelectFieldProps>()

const emit = defineEmits(['get:event', 'update:modelValue', 'validation:error'])

const errorMessage = ref<string>('')

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  errorMessage.value = ''

  // Check if the field is required and empty
  if (props.isRequired && !value) {
    errorMessage.value = 'This field is required.'
  }

  emit('get:event', event)
  emit('update:modelValue', value)
  emit('validation:error', errorMessage.value)
}

const computedOptions = computed(() => {
  return !Array.isArray(props.options) && typeof props.options === 'object'
    ? Object.entries(props.options).map(([value, text]) => {
        return {
          value,
          text,
          disabled: false,
        }
      })
    : props.options
})
</script>
