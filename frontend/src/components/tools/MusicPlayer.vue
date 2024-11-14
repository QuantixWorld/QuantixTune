<template>
  <div v-if="playerState" id="player">
    <div id="player_content">
      <div id="track">
        <img :src="playerState.item.album.images[2].url" alt="album image" />
        <div id="track-info">
          <p>{{ playerState.item.name }}</p>
          <p>{{ playerState.item.artists[0].name }}</p>
        </div>
      </div>
      <div id="player_buttons">
        <i
          class="fa-solid fa-shuffle fa-xl"
          :style="{ color: playerState.shuffle_state ? '#1db9d2' : 'white' }"
        ></i>

        <i class="fa-solid fa-backward-step fa-2xl"></i>
        <i v-if="!playerState?.is_playing" class="fa-solid fa-play fa-2xl" @click="togglePlayer"></i>
        <i v-if="playerState?.is_playing" class="fa-solid fa-pause fa-2xl" @click="togglePlayer"></i>
        <i class="fa-solid fa-forward-step fa-2xl"></i>
        <i
          class="fa-solid fa-repeat fa-xl"
          :style="{ color: playerState.repeat_state != 'off' ? '#1db9d2' : 'white' }"
        ></i>
      </div>
      <div id="tools">
        <i class="fa-solid fa-microphone-lines fa-1x coming_soon"></i>
        <i class="fa-solid fa-satellite-dish fa-1x coming_soon"></i>
        <i class="fa-solid fa-bars-staggered fa-1x coming_soon"></i>
        <i v-if="playerState.device.volume_percent == 0" class="fa-solid fa-volume-xmark fa-1x"></i>
        <i
          v-if="playerState.device.volume_percent > 0 && playerState.device.volume_percent < 75"
          class="fa-solid fa-volume-low fa-1x"
        ></i>
        <i v-if="playerState.device.volume_percent >= 75" class="fa-solid fa-volume-high fa-1x"></i>
        <div id="volume">
          <div
            id="volume_percentage"
            :style="{ width: playerState.device.volume_percent + '%' }"
          ></div>
        </div>
      </div>
    </div>
    <div id="time">
      <p id="current_time">{{ formatTime(playerState?.progress_ms || 0) }}</p>
      <div id="timebar">
        <div
          id="progress"
          :style="{ width: getProgressPercentage + '%' }"
        ></div>
      </div>
      <p id="time_length">{{ formatTime(playerState?.item.duration_ms || 0) }}</p>
    </div>
  </div>
  <div v-else id="no_playerState">
    <p>Unable to display the player at the moment</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { fetchPlayerState, pausePlayer } from '@/services/musicPlayerService'
import type { PlayerState } from '@/types/PlayerState'

export default defineComponent({
  name: 'PlayerComponent',
  setup() {
    const playerState = ref<PlayerState | null>(null)
    const playerInterval = ref<number | null>(null)

    const getPlayerState = async () => {
      try {
        playerState.value = await fetchPlayerState()
      } catch (error) {
        console.error('Error fetching player state:', error)
      }
    }

    const startPolling = () => {
      getPlayerState()

      stopPolling()

      playerInterval.value = setInterval(() => {
        getPlayerState()
      }, 1000)
    }

    const stopPolling = () => {
      if (playerInterval.value !== null) {
        clearInterval(playerInterval.value)
        playerInterval.value = null
      }
    }

    const togglePlayer = async () => {
      if (playerState.value?.is_playing) {
        await pausePlayer();
      }
    }

    onMounted(() => {
      startPolling()
    })

    onBeforeUnmount(() => {
      stopPolling()
    })

    return {
      playerState,
      togglePlayer,
      getProgressPercentage: computed(() => {
        const progress = playerState.value?.progress_ms || 0
        const duration = playerState.value?.item.duration_ms || 1
        return (progress / duration) * 100
      }),
      formatTime(ms: number) {
        let seconds = Math.floor(ms / 1000)
        const minutes = Math.floor(seconds / 60)
        seconds -= minutes * 60
        return minutes + ":" + ("0" + seconds).slice(-2)
      },
    }
  }
})
</script>


<style scoped>
@import url('@/assets/style/components/Player');
</style>
