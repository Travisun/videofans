<template>
  <div class="video-player">
    <video
        ref="videoRef"
        class="w-full max-h-[70vh] bg-black"
        controls
        :src="mediaUrl"
        @play="isPlaying = true"
        @pause="isPlaying = false"
    >
      Your browser does not support the video tag.
    </video>
    <div class="mt-4">
      <h3 class="text-xl font-bold">{{ props.videoName }}</h3>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  videoUrl: String,
  videoName: String
});

const mediaUrl = `http://localhost:3000`+props.videoUrl;

const videoRef = ref(null);
const isPlaying = ref(false);
</script>