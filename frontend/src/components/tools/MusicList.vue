<template>
  <div ref="scrollContainerRef" id="music-list">
    <div id="recently-played" class="section" v-if="recentlyPlayed">
      <div class="track" v-for="(item, index) in recentlyPlayed.items" :key="index">
        <img :src="item.track.is_local
          ? 'src/assets/images/local_file_icon.svg'
          : item.track.album.images[2]?.url" alt="Track Image" class="track-image" />
        <div class="track-details">
          <p class="track-title">{{ item.track.name }}</p>
          <p class="track-artists">{{ item.track.artists.map(artist => artist.name).join(', ') }}</p>
        </div>
      </div>
    </div>
    <h3>Recently Played</h3>

    <div class="track current-track" v-if="queue && queue.currently_playing">
      <img :src="queue.currently_playing.is_local
        ? 'src/assets/images/local_file_icon.svg'
        : queue.currently_playing.album.images[2]?.url" alt="Track Image" class="track-image" />
      <div class="track-details">
        <p class="track-title">{{ queue.currently_playing.name }}</p>
        <p class="track-artists">{{ queue.currently_playing.artists.map(artist => artist.name).join(', ') }}</p>
      </div>
    </div>
    <h3>Queue</h3>
    <div id="queue" class="section" v-if="queue && queue.queue.slice(0, 20)">
      <div class="track" v-for="(item, index) in queue.queue" :key="index">
        <img :src="item.is_local
          ? 'src/assets/images/local_file_icon.svg'
          : item.album.images[2]?.url" alt="Track Image" class="track-image" />
        <div class="track-details">
          <p class="track-title">{{ item.name }}</p>
          <p class="track-artists">{{ item.artists.map(artist => artist.name).join(', ') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, onBeforeUnmount } from 'vue'
import {
  fetchRecentlyPlayed,
  fetchQueue
} from '@/services/musicPlayerService'
import type { RecentlyPlayed, Queue } from '@/types/request'

export default defineComponent({
  name: 'MusicList',
  setup() {
    const scrollContainerRef = ref<HTMLDivElement | null>(null)
    const recentlyPlayed = ref<RecentlyPlayed | null>(null)
    const queue = ref<Queue | null>(null)
    const playerInterval = ref<number | null>(null)

    const getRecentlyPlayed = async () => {
      try {
        recentlyPlayed.value = await fetchRecentlyPlayed(20);
      } catch (error) {
        console.error('Error fetching recently played: ', error);
      }
    }

    const getQueue = async () => {
      try {
        queue.value = await fetchQueue();
      } catch (error) {
        console.error('Error fetching queue: ', error);
      }
    }

    const startPolling = () => {
      getRecentlyPlayed()
      getQueue()

      if (scrollContainerRef.value) {
        scrollContainerRef.value.scrollTop =
          (scrollContainerRef.value.scrollHeight - scrollContainerRef.value.clientHeight) / 2
      }

      stopPolling()

      playerInterval.value = setInterval(() => {
        getRecentlyPlayed()
        getQueue()
      }, 1000)
    }

    const stopPolling = () => {
      if (playerInterval.value !== null) {
        clearInterval(playerInterval.value)
        playerInterval.value = null
      }
    }

    onMounted(() => {
      startPolling()
    })

    onBeforeUnmount(() => {
      stopPolling()
    })

    return {
      scrollContainerRef,
      recentlyPlayed,
      queue
    }
  },
})
</script>

<style scoped>
@import url('../../assets/style/components/MusicList.css');
</style>
