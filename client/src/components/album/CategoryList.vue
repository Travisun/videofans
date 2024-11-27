<!-- src/components/album/CategoryList.vue -->
<template>
  <div class="flex-1 overflow-y-auto">
    <div class="p-2">
      <template v-for="category in categories" :key="category.id">
        <CategoryItem
            :category="category"
            :selected-id="selectedId"
            :depth="0"
            @select="$emit('select', $event)"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CategoryItem from './CategoryItem.vue'

const props = defineProps({
  categories: Array,
  selectedId: String
})

defineEmits(['select'])
</script>