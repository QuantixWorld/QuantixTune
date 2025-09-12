<template>
  <div ref="scrollContainerRef" id="music-list" class="scroll">
    <div id="recently-played" class="section" v-if="recentlyPlayed">
      <TrackDisplay
        v-for="track in recentlyPlayed?.items"
        :key="track.track.id"
        :track="track.track"
        :liked="likedTracks[track.track.id]"
      />
    </div>
    <h3>Recently Played</h3>

    <TrackDisplay
      class="current-track"
      v-if="queue && queue.currently_playing"
      :key="queue.currently_playing.id"
      :track="queue.currently_playing"
      :liked="likedTracks[queue.currently_playing.id]"
    />

    <h3>Queue</h3>
    <div id="queue" class="section" v-if="queue && queue.queue">
      <TrackDisplay
        v-for="track in queue.queue.slice(0, 20)"
        :key="track.id"
        :track="track"
        :liked="likedTracks[track.id]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  fetchRecentlyPlayed,
  fetchQueue,
  isLiked,
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
    const likedTracks = ref<Record<string, boolean>>({})

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

    const updateLikedTracks = async () => {
      const ids: Array<string> = []

      if (recentlyPlayed.value) {
        recentlyPlayed.value.items.forEach((item) => {
          if (!item.track.is_local) ids.push(item.track.id)
        })
      }

      if (queue.value) {
        if (queue.value.currently_playing && !queue.value.currently_playing.is_local) {
          ids.push(queue.value.currently_playing.id)
        }
        queue.value.queue.forEach((track) => {
          if (!track.is_local) ids.push(track.id)
        })
      }

      if (ids.length === 0) {
        likedTracks.value = {}
        return
      }

      try {
        const liked = await isLiked(ids)
        const map: Record<string, boolean> = {}
        ids.forEach((id, index) => {
          map[id] = liked[index]
        })
        likedTracks.value = map
      } catch (error) {
        console.error('Error fetching liked state: ', error)
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
      await updateLikedTracks()

      await nextTick()

      setScrollToCenter()

      stopPolling()

      playerInterval.value = setInterval(async () => {
        await Promise.all([getRecentlyPlayed(), getQueue()])
        await updateLikedTracks()
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
      queue,
      likedTracks,
    }
  },
})
</script>

<style scoped>
@import url('../../assets/style/components/MusicList.css');
</style>
