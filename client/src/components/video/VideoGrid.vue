<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
    <div
        v-for="video in videos"
        :key="video.id"
        class="video-card group relative rounded-lg overflow-hidden cursor-pointer"
        @click="$emit('select', video)"
        @keydown.enter="$emit('select', video)"
        tabindex="0"
    >
      <!-- 视频封面 -->
      <div class="aspect-video bg-gray-800">
        <img
            v-if="video.cover"
            :src="video.cover"
            :alt="video.name"
            class="w-full h-full object-cover"
        />
        <div
            v-else
            class="w-full h-full flex items-center justify-center"
        >
          <Film class="w-12 h-12 text-gray-600" />
        </div>
      </div>

      <!-- 视频信息遮罩 -->
      <div class="
        absolute inset-0 bg-gradient-to-t from-black/80 to-transparent
        flex flex-col justify-end
        p-4
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
      ">
        <h3 class="text-lg font-medium truncate">{{ video.name }}</h3>
        <div class="text-sm text-gray-300 flex items-center gap-2">
          <Clock class="w-4 h-4" />
          <span>{{ formatDuration(video.duration) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Film, Clock } from 'lucide-vue-next'

defineProps({
  videos: Array
})

defineEmits(['select'])

const formatDuration = (seconds) => {
  if (!seconds) return '--:--'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`
}
</script>