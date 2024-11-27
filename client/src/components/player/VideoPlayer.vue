<template>
  <div class="video-player relative" @keydown="handleKeyDown">
    <video
        ref="videoRef"
        class="w-full h-screen bg-black"
        :src="videoUrl"
        :poster="poster"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleVideoLoaded"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @ended="handleVideoEnded"
        autoplay
    >
      Your browser does not support the video tag.
    </video>

    <PlayerControls
        v-if="!loading"
        :isPlaying="isPlaying"
        :currentTime="currentTime"
        :duration="duration"
        :show-next="true"
        @toggle-play="togglePlay"
        @seek="seek"
        @next="handleVideoEnded"
        :show-prev-next="true"
        @previous="$emit('video-previous')"
    />

    <!-- 倒计时提示 -->
    <div
        v-if="showNextPrompt"
        class="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 px-6 py-3 rounded-lg"
    >
      <p class="text-white">
        下一集将在 {{ nextVideoCountdown }} 秒后播放...
        <button
            class="ml-4 text-blue-400 hover:text-blue-300"
            @click="cancelAutoPlay"
        >
          取消
        </button>
      </p>
    </div>

    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, watch} from 'vue'
import { videoMemory } from '@/services/videoMemory.js'
import PlayerControls from './PlayerControls.vue'

const props = defineProps({
  videoUrl: String,
  videoId: String,
  poster: String
})

const emit = defineEmits(['video-ended', 'video-previous'])

const videoRef = ref(null)
const isPlaying = ref(false)
const loading = ref(true)
const currentTime = ref(0)
const duration = ref(0)
const showNextPrompt = ref(false)
const nextVideoCountdown = ref(5)
let countdownTimer = null

const handleVideoEnded = () => {
  showNextPrompt.value = true
  nextVideoCountdown.value = 5

  countdownTimer = setInterval(() => {
    nextVideoCountdown.value--
    if (nextVideoCountdown.value <= 0) {
      clearInterval(countdownTimer)
      showNextPrompt.value = false
      emit('video-ended')
    }
  }, 1000)
}

const cancelAutoPlay = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  showNextPrompt.value = false
}

const handleKeyDown = (event) => {
  switch (event.key) {
    case ' ':
    case 'Enter':
      event.preventDefault()
      togglePlay()
      break
    case 'ArrowLeft':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        emit('video-previous')
      } else {
        event.preventDefault()
        seek(-10)
      }
      break
    case 'ArrowRight':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        handleVideoEnded()
      } else {
        event.preventDefault()
        seek(10)
      }
      break
    case 'PageUp':
      event.preventDefault()
      emit('video-previous')
      break
    case 'PageDown':
      event.preventDefault()
      handleVideoEnded()
      break
  }
}


// 清理定时器
watch(() => props.videoUrl, () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  showNextPrompt.value = false
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})

const handleVideoLoaded = async () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
    const savedTime = videoMemory.getProgress(props.videoId)
    if (savedTime > 0) {
      videoRef.value.currentTime = savedTime
    }
    loading.value = false
  }
}

const handleTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime
    if (Math.floor(currentTime.value) % 30 === 0) {
      videoMemory.saveProgress(props.videoId, currentTime.value)
    }
  }
}

const togglePlay = () => {
  if (videoRef.value) {
    if (videoRef.value.paused) {
      videoRef.value.play()
    } else {
      videoRef.value.pause()
    }
  }
}

const seek = (seconds) => {
  if (videoRef.value) {
    const newTime = videoRef.value.currentTime + seconds
    videoRef.value.currentTime = Math.max(0, Math.min(newTime, duration.value))
  }
}

onUnmounted(() => {
  if (videoRef.value) {
    videoMemory.saveProgress(props.videoId, videoRef.value.currentTime)
  }
})
</script>