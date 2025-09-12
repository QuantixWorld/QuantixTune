<template>
  <div class="track-display">
    <img 
      :src="track.is_local
          ? 'src/assets/images/default_icon.svg'
          : track.album.images[2]?.url" 
        alt="Track Image" 
        class="track-image" />
        <div class="track-details">
          <p class="track-title">{{ track.name }}</p>
          <p class="track-artists">{{ track.artists.map(artist => artist.name).join(', ') }}</p>
        </div>
        <div class="track-icons">
          <i v-if="track.is_local" class="fa-solid fa-triangle-exclamation"></i>
          <i
            v-else
            :class="isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
            @click="toggleLike"
          ></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'
import type { Track } from '@/types/index'
import { saveTracks, unsaveTracks } from '@/services/musicPlayerService'

// Define props directly using defineProps
const props = defineProps<{
  track: Track
  liked?: boolean
}>()

// Destructure props for easier use in the template
const { track } = props

const isLiked = ref(props.liked ?? false)

watch(
  () => props.liked,
  (newVal) => {
    isLiked.value = newVal ?? false
  },
)

const toggleLike = async () => {
  if (track.is_local) return
  try {
    if (isLiked.value) {
      await unsaveTracks([track.id])
    } else {
      await saveTracks([track.id])
    }
    isLiked.value = !isLiked.value
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}
</script>

<style scoped>
@import url('@/assets/style/components/TrackDisplay.css');
</style>
