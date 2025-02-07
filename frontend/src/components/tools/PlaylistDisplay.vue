<template>
  <div class="playlist-display">
    <img :src="img ? img : 'src/assets/images/local_file_icon.svg'" alt="Local file icon">
    <div id="pc_playlist-info">
        <p>{{ title }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

// Define props directly using defineProps
const props = defineProps<{
  img: string
  title: string
}>()

// Destructure props for easier use in the template
const { img, title } = props
</script>

<style scoped>
@import url('@/assets/style/components/PlaylistDisplay.css');
</style>
