<template>
  <div class="absolute top-4 right-4 z-10">
    <button
        @click="isOpen = !isOpen"
        class="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:ring-blue-500"
        @keydown.escape="isOpen = false"
    >
      <Menu class="w-6 h-6" />
    </button>

    <div
        v-if="isOpen"
        class="absolute top-12 right-0 bg-gray-800 rounded-lg shadow-lg p-2"
    >
      <button
          v-for="item in menuItems"
          :key="item.action"
          class="flex w-[120px] py-4 px-4 text-center rounded hover:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          @click="handleAction(item.action)"
      >
        <component :is="item.icon" class="w-6 h-6 inline mr-2" />
        <span class="block">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, Home, RefreshCw } from 'lucide-vue-next'

const isOpen = ref(false)

const menuItems = [
  { label: '主页', action: 'home', icon: Home },
  { label: '刷新', action: 'refresh', icon: RefreshCw }
]

const emit = defineEmits(['home', 'refresh'])

const handleAction = (action) => {
  emit(action)
  isOpen.value = false
}
</script>