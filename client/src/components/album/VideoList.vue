<template>
  <div class="flex-1 overflow-y-auto bg-gray-700">
    <div class="p-2 space-y-1">
      <button
          v-for="video in videos"
          :key="video.id"
          :class="[
          'w-full p-4 text-left rounded hover:bg-gray-600 focus:ring-2 focus:ring-blue-500',
          selectedVideo?.id === video.id ? 'bg-gray-600' : ''
        ]"
          @click="$emit('select', video)"
          @keydown.enter="$emit('select', video)"
          tabindex="0"
      >
        {{ video.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  videos: Array,
  selectedVideo: Object
})

defineEmits(['select'])
</script>