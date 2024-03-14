<template>
  <div :class="['flex relative flex-col gap-1 w-full mb-6', containerClass]">
    <div>
      <label v-if="label" :for="id" :class="['input-label', labelClass]">
        {{ label }}
      </label>
      <input
        ref="inputRef"
        :type="type"
        :id="id"
        data-card-field
        :value="modelValue"
        :max="max"
        :min="min"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :class="[
          'input-field',
          inputClass,
          {
            'border-red-500': errorMessage,
          },
        ]"
        @input="validateAndEmit"
        @blur="onBlur"
        @focus="onFocus"
      />
    </div>

    <span v-if="errorMessage" class="text-red-500 text-sm mt-1">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { TextFieldProps } from '@/types/Inputs'
import { ref, onMounted, onUnmounted, defineProps, withDefaults } from 'vue'

const props = withDefaults(defineProps<TextFieldProps>(), {
  type: 'text',
})

const emit = defineEmits(['get:event', 'update:modelValue', 'validation:error'])

const inputRef = ref<HTMLElement | null>(null)
const errorMessage = ref<string>('')

const validateAndEmit = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value

  errorMessage.value = ''

  // Check if the field is required and empty
  if (props.isRequired && !value) {
    errorMessage.value = 'This field is required.'
  }

  // Min and Max validation for numeric inputs
  if (props.type === 'number') {
    const numericValue = parseFloat(value)
    if (props.min !== undefined && numericValue < props.min) {
      errorMessage.value = `${props.label || 'Value'} must be at least ${
        props.min
      }.`
    }
    if (props.max !== undefined && numericValue > props.max) {
      errorMessage.value = `${props.label || 'Value'} must be no more than ${
        props.max
      }.`
    }
  }

  // Maxlength validation
  if (props.maxlength !== undefined && value.length > props.maxlength) {
    errorMessage.value = `Maximum length of ${props.maxlength} exceeded.`
  }

  emit('get:event', event)
  emit('update:modelValue', value)
  emit('validation:error', errorMessage.value)
}

const checkNumberValue = (event: KeyboardEvent) => {
  if (
    event.charCode < 48 ||
    event.charCode > 57 ||
    (props.maxlength !== undefined &&
      String(props.modelValue)?.length >= props.maxlength)
  ) {
    event.preventDefault()
  }
}

const checkLetterValue = (event: KeyboardEvent) => {
  if (event.charCode >= 48 && event.charCode <= 57) {
    event.preventDefault()
  }
}

onMounted(() => {
  if (inputRef.value) {
    if (props.inputRestriction === 'numberOnly') {
      inputRef.value.addEventListener('keypress', checkNumberValue)
    } else if (props.inputRestriction === 'letterOnly') {
      inputRef.value.addEventListener('keypress', checkLetterValue)
    }
  }
})

onUnmounted(() => {
  if (inputRef.value) {
    if (props.inputRestriction === 'numberOnly') {
      inputRef.value.removeEventListener('keypress', checkNumberValue)
    } else if (props.inputRestriction === 'letterOnly') {
      inputRef.value.removeEventListener('keypress', checkLetterValue)
    }
  }
})
</script>
