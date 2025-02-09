<template>
  <div class="track-display">
    <img :src="track.is_local
          ? 'src/assets/images/default_icon.svg'
          : track.album.images[2]?.url" alt="Track Image" class="track-image" />
        <div class="track-details">
          <p class="track-title">{{ track.name }}</p>
          <p class="track-artists">{{ track.artists.map(artist => artist.name).join(', ') }}</p>
        </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Track } from '@/types/index'

// Define props directly using defineProps
const props = defineProps<{
  track: Track
}>()

// Destructure props for easier use in the template
const { track } = props
</script>

<style scoped>
@import url('@/assets/style/components/TrackDisplay.css');
</style>
