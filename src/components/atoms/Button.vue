<template>
  <button
    :class="[
      computedButtonClass,
      extraClasses,
      {
        'opacity-50 cursor-not-allowed': isDisabled,
      },
    ]"
    :disabled="isDisabled"
    @click="handleClick"
  >
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'

export default defineComponent({
  name: 'BaseButton',
  props: {
    text: {
      type: String as PropType<string>,
      required: true,
    },
    type: {
      type: String as PropType<'primary' | 'white'>,
      default: 'primary',
    },
    isDisabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    extraClasses: String,
  },
  emits: ['click'],
  setup(props, { emit }) {
    const computedButtonClass = computed(() => {
      switch (props.type) {
        case 'primary':
          return 'bg-primary text-white px-4 py-2 rounded-md'
        case 'white':
          return 'bg-white text-primary border border-primary px-4 py-2 rounded-md'
        default:
          return 'bg-primary text-white px-4 py-2 rounded-md'
      }
    })

    function handleClick() {
      emit('click')
    }

    return { computedButtonClass, handleClick }
  },
})
</script>
