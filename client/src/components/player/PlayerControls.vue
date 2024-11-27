<template>
  <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
    <div class="flex items-center justify-center space-x-4">
      <!-- 上一集按钮 -->
      <button
          v-if="showPrevNext"
          class="p-4 rounded-full hover:bg-white/20 focus:ring-2 focus:ring-blue-500"
          @click="$emit('previous')"
          title="上一集"
      >
        <SkipBack class="w-8 h-8" />
      </button>

      <button
          class="p-4 rounded-full hover:bg-white/20 focus:ring-2 focus:ring-blue-500"
          @click="$emit('seek', -10)"
          title="快退10秒"
      >
        <Rewind class="w-8 h-8" />
      </button>

      <button
          class="p-4 rounded-full hover:bg-white/20 focus:ring-2 focus:ring-blue-500"
          @click="$emit('toggle-play')"
          :title="isPlaying ? '暂停' : '播放'"
      >
        <component
            :is="isPlaying ? Pause : Play"
            class="w-12 h-12"
        />
      </button>

      <button
          class="p-4 rounded-full hover:bg-white/20 focus:ring-2 focus:ring-blue-500"
          @click="$emit('seek', 10)"
          title="快进10秒"
      >
        <FastForward class="w-8 h-8" />
      </button>

      <!-- 下一集按钮 -->
      <button
          v-if="showPrevNext"
          class="p-4 rounded-full hover:bg-white/20 focus:ring-2 focus:ring-blue-500"
          @click="$emit('next')"
          title="下一集"
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
import { Play, Pause, FastForward, Rewind, SkipForward, SkipBack } from 'lucide-vue-next'

defineProps({
  isPlaying: Boolean,
  currentTime: Number,
  duration: Number,
  showPrevNext: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-play', 'seek', 'next', 'previous'])

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
</script>