<!-- src/components/folder/VideoItem.vue -->
<template>
  <div
      class="video-item px-4 py-2 cursor-pointer hover:bg-gray-700/30"
      :class="{ 'ml-4': depth > 0 }"
      @click="$emit('select', video)"
  >
    <div class="flex items-center gap-2">
      <Film class="w-4 h-4 text-gray-400" />
      <span class="flex-1">{{ video.name }}</span>
      <span class="text-sm text-gray-400">{{ formatSize }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Film } from 'lucide-vue-next'

const props = defineProps({
  video: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
})

defineEmits(['select'])

const formatSize = computed(() => {
  const size = props.video.size
  if (!size) return ''

  const units = ['B', 'KB', 'MB', 'GB']
  let value = size
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`
})
</script>