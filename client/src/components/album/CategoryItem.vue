<template>
  <div class="category-item">
    <!-- 分类标题和封面 -->
    <button
        :class="[
        'w-full p-2 rounded-lg flex items-center gap-3 hover:bg-gray-700',
        'transition-colors duration-200',
        selectedId === category.id ? 'bg-gray-700' : '',
        `ml-${depth * 4}`
      ]"
        @click="handleSelect"
    >
      <!-- 展开/折叠图标 -->
      <ChevronRight
          v-if="hasChildren"
          :class="[
          'w-4 h-4 transition-transform',
          isExpanded ? 'rotate-90' : ''
        ]"
      />
      <span v-else class="w-4"></span>

      <!-- 封面缩略图 -->
      <div
          v-if="category.cover"
          class="w-12 h-8 rounded bg-center bg-cover"
          :style="`background-image: url(${category.cover})`"
      ></div>

      <!-- 分类名称 -->
      <span class="flex-1 truncate">{{ category.name }}</span>

      <!-- 视频数量 -->
      <span
          v-if="category.videos?.length"
          class="text-sm text-gray-400"
      >
        {{ category.videos.length }}
      </span>
    </button>

    <!-- 子分类 -->
    <div v-if="hasChildren && isExpanded" class="mt-1">
      <CategoryItem
          v-for="child in category.children"
          :key="child.id"
          :category="child"
          :selected-id="selectedId"
          :depth="depth + 1"
          @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  category: Object,
  selectedId: String,
  depth: {
    type: Number,
    default: 0
  }
})

const isExpanded = ref(false)
const hasChildren = computed(() =>
    props.category.children?.length > 0
)

const handleSelect = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value
  }
  emit('select', props.category)
}

const emit = defineEmits(['select'])
</script>