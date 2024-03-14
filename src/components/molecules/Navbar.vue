<template>
  <div
    class="flex justify-between items-center p-4 shadow bg-white z-10 h-[100px]"
  >
    <Logo
      :class="['fill-primary w-[120px] flex', { 'lg:hidden': isSidebarOpen }]"
    />

    <button
      :class="[
        'transition-all hover:scale-125 text-3xl text-primary',
        { 'rotate-[15deg]': isSidebarOpen },
      ]"
      @click="emitToggleSidebar"
    >
      <span v-if="isSidebarOpen" class="transform lg:flex hidden"
        >&#x2715;</span
      >
      <span v-else>&#x2630;</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
import Logo from '@/components/atoms/Logo.vue'

// Define the event that this component can emit
const emit = defineEmits(['toggleSidebar'])

defineProps({
  isSidebarOpen: Boolean,
})

// Function to emit the toggleSidebar event
const emitToggleSidebar = () => {
  emit('toggleSidebar')
}
</script>

<style scoped>
/* Additional styles can go here */
</style>
./atoms/Logo.vue
