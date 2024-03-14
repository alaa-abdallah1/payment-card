<template>
  <div
    id="app"
    class="flex h-screen bg-gray-100 min-w-[300px] max-w-6xl mx-auto"
  >
    <Sidebar
      v-if="isSidebarOpen"
      :isSidebarOpen="isSidebarOpen"
      @update:isSidebarOpen="toggleSidebar"
    />

    <!-- Main content -->
    <div class="flex-1 space-y-8 md:space-y-12">
      <header>
        <Navbar :isSidebarOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" />
      </header>
      <main class="overflow-auto px-4 md:px-12">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watchEffect } from 'vue'
import Sidebar from '@/components/molecules/Sidebar.vue'
import Navbar from '@/components/molecules/Navbar.vue'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Reactive variable to track if the device is mobile
const isMobile = ref<boolean>(window.innerWidth < 1024)

// Watch for changes in window size to update isMobile
watchEffect(() => {
  const updateIsMobile = () => {
    isMobile.value = window.innerWidth < 1024
  }

  window.addEventListener('resize', updateIsMobile)

  // Cleanup function to remove the event listener when the component unmounts or watchEffect is re-invoked
  return () => {
    window.removeEventListener('resize', updateIsMobile)
  }
})

provide('isMobile', isMobile)
</script>
