<template>
  <AppLayout />
</template>

<script setup>
import AppLayout from './components/layout/AppLayout.vue'
import {onMounted} from "vue";
import {videoMemory} from "@/services/videoMemory.js";

onMounted(() => {
  // 启动时清理过期播放记录
  videoMemory.cleanup()
})
</script>