<template>
  <div class="album-list">
    <div v-for="album in albums" :key="album.name" class="mb-8">
      <h2 class="text-2xl font-bold mb-4">{{ album.name }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
            v-for="video in album.videos"
            :key="video.url"
            class="video-card p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            @click="$emit('select-video', video)"
        >
          <div class="flex items-start space-x-2">
            <div class="flex-grow">
              <h3 class="font-medium mb-1">{{ video.name }}</h3>
              <p v-if="video.relativePath" class="text-sm text-gray-500">
                {{ video.relativePath }}
              </p>
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-500">
            <div>大小: {{ formatFileSize(video.size) }}</div>
            <div>修改时间: {{ formatDate(video.modifiedTime) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  albums: {
    type: Array,
    required: true
  }
})

defineEmits(['select-video'])

function formatFileSize(bytes) {
  if (!bytes) return '未知'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}

function formatDate(dateString) {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleString()
}
</script>