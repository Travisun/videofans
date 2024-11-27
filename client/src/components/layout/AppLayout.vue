<template>
  <div class="flex h-screen max-h-screen overflow-y-hidden bg-gray-900 text-gray-100">
    <!-- 左侧边栏 -->
    <AppSidebar
        :media-data="mediaData"
        :selected-video="selectedVideo"
        @select-video="handleVideoSelect"
        @update-playlist="handlePlaylistUpdate"
    />

    <!-- 右侧内容区 -->
    <div class="flex-1 flex flex-col relative">
      <QuickMenu
          @refresh="refreshMediaData"
          @home="goHome"
      />

      <div class="flex-1 bg-black">
        <VideoPlayer
            v-if="selectedVideo"
            :video-url="`http://192.168.2.181:3299${selectedVideo.url}`"
            :video-id="selectedVideo.id"
            :poster="selectedVideo.poster"
            @video-ended="playNextVideo"
            @video-previous="playPreviousVideo"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import AppSidebar from './AppSidebar.vue'
import VideoPlayer from '../player/VideoPlayer.vue'
import QuickMenu from '../ui/QuickMenu.vue'

const mediaData = ref([])
const selectedVideo = ref(null)
const currentPlaylist = ref([])
const currentPlaylistIndex = ref(-1)

// 更新播放列表
const handlePlaylistUpdate = (videos) => {
  console.log(videos);

  currentPlaylist.value = videos
}

// 处理视频选择
const handleVideoSelect = (video) => {
  selectedVideo.value = video
  // 更新当前播放索引
  currentPlaylistIndex.value = currentPlaylist.value.findIndex(v => v.path === video.path)
}

// 播放上一个视频
const playPreviousVideo = () => {
  if (currentPlaylist.value.length === 0) return

  // 计算上一个视频的索引
  const prevIndex = (currentPlaylistIndex.value - 1 + currentPlaylist.value.length) % currentPlaylist.value.length
  selectedVideo.value = currentPlaylist.value[prevIndex]
  currentPlaylistIndex.value = prevIndex
}

// 播放下一个视频
const playNextVideo = () => {
  if (currentPlaylist.value.length === 0) return

  // 计算下一个视频的索引
  const nextIndex = (currentPlaylistIndex.value + 1) % currentPlaylist.value.length
  // 设置新的当前视频
  selectedVideo.value = currentPlaylist.value[nextIndex]
  currentPlaylistIndex.value = nextIndex
}

// 键盘导航处理
const handleKeyNav = (event) => {
  switch (event.key) {
    case 'Escape':
      if (selectedVideo.value) {
        selectedVideo.value = null
      }
      break
    case 'Tab':
      // 防止 Tab 键默认行为，使用方向键导航
      event.preventDefault()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyNav)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyNav)
})


// 刷新媒体数据
const refreshMediaData = async () => {
  try {
    const response = await fetch('http://192.168.2.181:3299/api/directory')
    const data = await response.json()
    mediaData.value = Array.isArray(data) ? data : [data]
  } catch (error) {
    console.error('Error fetching media data:', error)
  }
}

// 返回主页
const goHome = () => {
  selectedVideo.value = null
}

onMounted(refreshMediaData)
</script>