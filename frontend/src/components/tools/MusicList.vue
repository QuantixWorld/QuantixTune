<template>
  <div ref="scrollContainerRef" id="music-list">
    <div id="recently-played" class="section" v-if="recentlyPlayed">
      <TrackDisplay v-for="track in recentlyPlayed?.items" :key="track.track.id" :track="track.track" />
    </div>
    <h3>Recently Played</h3>

    <TrackDisplay class="current-track" v-if="queue && queue.currently_playing" :key="queue.currently_playing.id"
      :track="queue.currently_playing" />

    <h3>Queue</h3>
    <div id="queue" class="section" v-if="queue && queue.queue.slice(0, 20)">
      <TrackDisplay v-for="track in queue?.queue" :key="track.id" :track="track" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  fetchRecentlyPlayed,
  fetchQueue
} from '@/services/musicPlayerService'
import type { RecentlyPlayed, Queue } from '@/types/request'
import TrackDisplay from './TrackDisplay.vue';

export default defineComponent({
  name: 'MusicList',
  components: {
    TrackDisplay
  },
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

    const setScrollToCenter = () => {
      if (scrollContainerRef.value) {
        scrollContainerRef.value.scrollTop =
          (scrollContainerRef.value.scrollHeight - scrollContainerRef.value.clientHeight) / 2 - 10
      }
    }

    const startPolling = async () => {
      await Promise.all([getRecentlyPlayed(), getQueue()])

      await nextTick()

      setScrollToCenter()

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
