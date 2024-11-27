<template>
  <div>
    <!-- Folder header -->
    <div
        class="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded"
        :class="{ 'ml-6': depth > 0 }"
        @click="hasChildren && toggleExpand()"
    >
      <!-- Expand/Collapse arrow -->
      <component
          :is="hasChildren ? (isExpanded ? ChevronDown : ChevronRight) : 'div'"
          class="w-4 h-4"
      />

      <!-- Folder icon -->
      <Folder class="w-5 h-5 text-blue-500" />

      <!-- Folder name and video count -->
      <span class="font-medium">{{ item.name }}</span>
      <span v-if="item.videos?.length" class="text-sm text-gray-500">
        ({{ item.videos.length }})
      </span>
    </div>

    <!-- Expanded content -->
    <template v-if="isExpanded">
      <!-- Subdirectories -->
      <FolderItem
          v-for="subDir in item.subdirectories"
          :key="subDir.path"
          :item="subDir"
          :depth="depth + 1"
          @select-video="$emit('select-video', $event)"
      />

      <!-- Videos in current folder -->
      <div
          v-for="video in item.videos"
          :key="video.path"
          class="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
          :class="{ 'ml-6': depth > 0 }"
          style="padding-left: 3rem;"
          @click="$emit('select-video', video)"
      >
        <Film class="w-4 h-4 text-gray-500" />
        <span>{{ video.name }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, ChevronRight, Folder, Film } from 'lucide-vue-next'

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

defineEmits(['select-video'])

const isExpanded = ref(false)
const hasChildren = computed(() => {
  return (props.item.subdirectories?.length > 0 || props.item.videos?.length > 0)
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>