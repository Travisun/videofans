<template>
  <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
    <div class="flex items-center justify-center space-x-4">
      <button
          class="p-4 rounded-full hover:bg-white/20 focus:ring-2 focus:ring-blue-500"
          @click="$emit('seek', -10)"
      >
        <Rewind class="w-8 h-8" />
      </button>

      <button
          class="p-4 rounded-full hover:bg-white/20 focus:ring-2 focus:ring-blue-500"
          @click="$emit('toggle-play')"
      >
        <component
            :is="isPlaying ? Pause : Play"
            class="w-12 h-12"
        />
      </button>

      <button
          class="p-4 rounded-full hover:bg-white/20 focus:ring-2 focus:ring-blue-500"
          @click="$emit('seek', 10)"
      >
        <FastForward class="w-8 h-8" />
      </button>

      <button
          v-if="showNext"
          class="p-4 rounded-full hover:bg-white/20 focus:ring-2 focus:ring-blue-500"
          @click="$emit('next')"
      >
        <SkipForward class="w-8 h-8" />
      </button>
    </div>

    <div class="mt-4 flex items-center text-sm">
      <span>{{ formatTime(currentTime) }}</span>
      <div class="mx-2 flex-1 h-1 bg-white/30 rounded-full">
        <div
            class="h-full bg-blue-500 rounded-full"
            :style="{width: `${(currentTime / duration) * 100}%`}"
        />
      </div>
      <span>{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>

<script setup>
import { Play, Pause, FastForward, Rewind, SkipForward } from 'lucide-vue-next'

defineProps({
  isPlaying: Boolean,
  currentTime: Number,
  duration: Number,
  showNext: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-play', 'seek', 'next'])

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
</script>