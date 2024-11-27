<template>
  <div class="w-80 flex flex-col bg-gray-800 max-h-[100vh]">
    <div class="p-4 bg-gray-700">
      <h1 class="text-2xl font-normal">Videofans 家庭媒体中心</h1>
    </div>

    <FolderView
        :media-data="mediaData"
        @select-video="$emit('select-video', $event)"
        @update-playlist="updateList"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FolderView from '../album/FolderView.vue'

const props = defineProps({
  mediaData: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['select-video', 'update-playlist'])

const updateList = (videos)=>{
  emit('update-playlist', videos);
}

</script>