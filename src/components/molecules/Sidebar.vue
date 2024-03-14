<template>
  <aside class="relative h-full bg-black">
    <div
      class="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
      v-show="isSidebarOpen"
      @click="toggleSidebar"
    ></div>

    <div
      :class="[
        'flex flex-col space-y-4 transform top-0 left-0 absolute bg-primary h-full text-white py-1 w-[300px] inset-y-0 transition duration-300 ease-in-out z-30 lg:relative lg:translate-x-0 divide-y divide-purple-300',
        {
          'translate-x-0': props.isSidebarOpen,
          '-translate-x-full': !props.isSidebarOpen,
        },
      ]"
    >
      <div class="px-6 flex items-center justify-between">
        <div class="w-[120px]">
          <Logo class="fill-white" />
        </div>
        <span
          class="transform rotate-12 flex xs:hidden text-3xl relative top-2"
          @click="toggleSidebar"
          >&#x2715;</span
        >
      </div>
      <nav>
        <router-link
          v-for="(link, index) in links"
          :key="index"
          :to="link.route"
          class="flex items-center space-x-2 py-3 px-6 transition duration-200 hover:bg-purple-200 hover:text-black"
        >
          <span v-html="link.icon" class="text-2xl"></span>
          <span>{{ link.label }}</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '@/components/atoms/Logo.vue'

const props = defineProps({
  isSidebarOpen: Boolean,
})

const links = computed(() => [
  {
    label: 'Profile',
    route: '/profile',
    icon: '&#x26A5;',
  },
  {
    label: 'Payment',
    route: '/payment',
    icon: '&#8473;',
  },
])

const emit = defineEmits(['update:isSidebarOpen'])

const router = useRouter()
const isMobile = inject<Ref<boolean>>('isMobile')

const toggleSidebar = () => {
  emit('update:isSidebarOpen', !props.isSidebarOpen)
}

const closeSidebar = () => {
  if (props.isSidebarOpen) {
    emit('update:isSidebarOpen', false)
  }
}

// Use the isMobile reactive property to conditionally close the sidebar
router.afterEach(() => {
  if (isMobile?.value) {
    closeSidebar()
  }
})
</script>

<style>
.router-link-active {
  @apply bg-purple-900;
}
</style>
./atoms/Logo.vue
