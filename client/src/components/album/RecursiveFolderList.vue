<!-- src/components/folder/RecursiveFolderList.vue -->
<template>
  <div class="recursive-folder-list overflow-y-scroll overflow-x-hidden">
    <!-- 媒体库列表 -->
    <div v-for="library in mediaData" :key="library.path" class="mb-6">
      <div class="px-4 py-2 bg-gray-700/50">
        <h2 class="text-lg font-semibold flex items-center gap-2">
          <Database class="w-4 h-4" />
          {{ library.name }}
        </h2>
      </div>

      <!-- 递归文件夹结构 -->
      <div class="folder-structure">
        <FolderNode
            v-for="item in library.subdirectories"
            :key="item.path"
            :item="item"
            :depth="0"
            @select-video="handleVideoSelect"
        />

        <!-- 顶层视频文件 -->
        <VideoItem
            v-for="video in library.videos"
            :key="video.path"
            :video="video"
            :depth="0"
            @select="handleVideoSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Database } from 'lucide-vue-next'
import FolderNode from './FolderNode.vue'
import VideoItem from './VideoItem.vue'

const props = defineProps({
  mediaData: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select-video'])

const handleVideoSelect = (video) => {
  emit('select-video', video)
}
</script>

<style scoped>
.folder-structure {
  /* 添加缩进线条样式 */
  position: relative;
  margin-left: 1rem;
}

.folder-structure::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: rgb(75 85 99 / 0.5);
}
</style>