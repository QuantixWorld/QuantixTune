<template>
  <div class="playlist-display">
    <img :src="playlist.images[2] ? playlist.images[2].url : playlist.images[0] ? playlist.images[0].url : 'src/assets/images/local_file_icon.svg'" alt="Local file icon">
    <div id="pc_playlist-info">
        <p>{{ playlist.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SimplifiedPlaylist } from '@/types';
import { defineProps } from 'vue'

// Define props directly using defineProps
const props = defineProps<{
  playlist: SimplifiedPlaylist
}>()

// Destructure props for easier use in the template
const { playlist } = props
</script>

<style scoped>
@import url('@/assets/style/components/PlaylistDisplay.css');
</style>
