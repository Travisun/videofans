<template>
  <div class="album-list">
    <div v-for="album in albums" :key="album.name" class="mb-8">
      <h2 class="text-2xl font-bold mb-4">{{ album.name }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
            v-for="video in album.videos"
            :key="video.name"
            class="video-card p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
            @click="$emit('select-video', video)"
        >
          <h3 class="font-medium">{{ video.name }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  albums: {
    type: Array,
    required: true
  }
});

defineEmits(['select-video']);
</script>