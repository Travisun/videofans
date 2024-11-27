<!-- src/components/folder/FolderNode.vue -->
<template>
  <div class="folder-node">
    <!-- 文件夹标题行 -->
    <div
        class="folder-header"
        :class="[
        'flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-700/30',
        'transition-colors duration-200',
        {'bg-gray-700/20': isExpanded}
      ]"
        @click="toggleExpand"
    >
      <!-- 展开/折叠图标 -->
      <component
          :is="isExpanded ? ChevronDown : ChevronRight"
          class="w-4 h-4"
      />

      <!-- 文件夹图标和名称 -->
      <Folder class="w-4 h-4 text-blue-400" />
      <span class="flex-1">{{ item.name }}</span>

      <!-- 视频计数 -->
      <span v-if="totalCount" class="text-sm text-gray-400">
        {{ totalCount }}
      </span>
    </div>

    <!-- 展开的内容 -->
    <div v-show="isExpanded" class="folder-content ml-6">
      <!-- 递归渲染子文件夹 -->
      <FolderNode
          v-for="subDir in item.subdirectories"
          :key="subDir.path"
          :item="subDir"
          :depth="depth + 1"
          @select-video="$emit('select-video', $event)"
      />

      <!-- 当前文件夹的视频 -->
      <VideoItem
          v-for="video in item.videos"
          :key="video.path"
          :video="video"
          :depth="depth + 1"
          @select="$emit('select-video', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, ChevronRight, Folder } from 'lucide-vue-next'
import VideoItem from './VideoItem.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
})

console.log(props)

defineEmits(['select-video'])

const isExpanded = ref(false)

// 计算当前文件夹包含的所有视频数量
const totalCount = computed(() => {
  let count = props.item.videos?.length || 0

  // 递归计算子文件夹的视频数量
  if (props.item.subdirectories) {
    count += props.item.subdirectories.reduce((acc, dir) => {
      const videoCount = dir.videos?.length || 0
      return acc + videoCount
    }, 0)
  }

  return count
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>