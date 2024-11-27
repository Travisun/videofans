<!-- src/components/folder/FolderView.vue -->
<template>
  <div class="flex flex-col h-full bg-gray-800">
    <!-- 面包屑导航 -->
    <div class="flex items-center gap-2 px-4 py-3 bg-gray-700">
      <button
          v-if="currentPath.length > 0"
          class="flex items-center gap-1 text-gray-300 hover:text-white"
          @click="goBack"
      >
        <ChevronLeft class="w-5 h-5" />
        返回
      </button>
      <div v-else class="text-xl font-semibold">
        媒体库
      </div>
    </div>

    <!-- 文件列表 -->
    <div class="flex-1 overflow-y-auto">
      <div class="space-y-1 p-2 pb-[220px]">
        <!-- 文件夹 -->
        <button
            v-for="folder in currentFolders"
            :key="folder.path"
            :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded',
            'hover:bg-gray-700 focus:bg-gray-700 focus:outline-none',
            selectedIndex === folder.index ? 'bg-gray-700' : ''
          ]"
            @click="enterFolder(folder)"
            @keydown.enter="enterFolder(folder)"
        >
          <Folder class="w-5 h-5 text-blue-400" />
          <div class="flex-1 overflow-hidden">
            <div class="truncate">{{ folder.name }}</div>
          </div>
          <div class="text-sm text-gray-400">
            {{ folder.totalVideos }}个视频
          </div>
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </button>

        <!-- 视频文件 -->
        <button
            v-for="video in currentVideos"
            :key="video.path"
            :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded',
            'hover:bg-gray-700 focus:bg-gray-700 focus:outline-none',
            selectedIndex === video.index ? 'bg-gray-700' : ''
          ]"
            @click="$emit('select-video', video)"
            @keydown.enter="$emit('select-video', video)"
        >
          <Film class="w-5 h-5 text-gray-400" />
          <div class="flex-1 overflow-hidden">
            <div
                class="whitespace-nowrap"
                :class="{'animate-marquee': selectedIndex === video.index && video.name.length > 30}"
            >
              {{ video.name }}
            </div>
          </div>
          <div class="text-sm text-gray-400">
            {{ formatFileSize(video.size) }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Folder, Film, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  mediaData: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select-video', 'update-playlist'])



// 当前路径堆栈，存储完整的导航路径对象
const currentPath = ref([])
// 当前选中项索引
const selectedIndex = ref(0)

// 计算当前目录的内容
const currentContent = computed(() => {
  let content = props.mediaData

  if (currentPath.value.length === 0) {
    // 根目录：显示所有媒体库
    return content.map((item, index) => ({
      ...item,
      index,
      isFolder: true,
      totalVideos: countTotalVideos(item)
    }))
  }

  // 导航到当前文件夹
  let currentFolder = content.find(item => item.path === currentPath.value[0])

  // 遍历路径
  for (let i = 1; i < currentPath.value.length; i++) {
    if (!currentFolder) break
    currentFolder = currentFolder.subdirectories?.find(
        dir => dir.path === currentPath.value[i]
    )
  }

  if (!currentFolder) return []

  // 组合当前文件夹的子文件夹和视频
  const folders = (currentFolder.subdirectories || []).map((folder, index) => ({
    ...folder,
    index,
    isFolder: true,
    totalVideos: countTotalVideos(folder)
  }))

  const videos = (currentFolder.videos || []).map((video, index) => ({
    ...video,
    index: folders.length + index,
    isFolder: false
  }))

  return [...folders, ...videos]
})

const currentFolders = computed(() =>
    currentContent.value.filter(item => item.isFolder)
)

const currentVideos = computed(() =>
    currentContent.value.filter(item => !item.isFolder)
)

// 计算文件夹内总视频数
function countTotalVideos(folder) {
  let count = folder.videos?.length || 0
  if (folder.subdirectories) {
    for (const subdir of folder.subdirectories) {
      count += countTotalVideos(subdir)
    }
  }
  return count
}

// 当进入一个文件夹时，设置播放列表
function enterFolder(folder) {
  currentPath.value.push(folder.path)
  selectedIndex.value = 0

  // 获取当前文件夹中的所有视频
  const currentFolder = getCurrentFolder()
  if (currentFolder && currentFolder.videos) {
    // 发送播放列表更新事件
    emit('update-playlist', currentFolder.videos)
  }
}

// 获取当前文件夹
function getCurrentFolder() {
  let current = props.mediaData

  for (const path of currentPath.value) {
    if (Array.isArray(current)) {
      current = current.find(item => item.path === path)
    } else {
      current = current.subdirectories?.find(dir => dir.path === path)
    }
    if (!current) return null
  }

  return current
}

// 返回上一级
function goBack() {
  currentPath.value.pop()
  selectedIndex.value = 0
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (!bytes) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

// 键盘导航
function handleKeyDown(event) {
  const itemCount = currentContent.value.length
  if (itemCount === 0) return

  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = (selectedIndex.value - 1 + itemCount) % itemCount
      break
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % itemCount
      break
    case 'ArrowLeft':
      if (currentPath.value.length > 0) {
        event.preventDefault()
        goBack()
      }
      break
    case 'Enter':
      const selectedItem = currentContent.value[selectedIndex.value]
      if (selectedItem?.isFolder) {
        enterFolder(selectedItem)
      } else if (selectedItem) {
        emit('select-video', selectedItem)
      }
      break
  }
}

// 监听键盘事件
watch(
    () => props.mediaData,
    () => {
      currentPath.value = []
      selectedIndex.value = 0
    }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.animate-marquee {
  animation: marquee 15s linear infinite;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
</style>