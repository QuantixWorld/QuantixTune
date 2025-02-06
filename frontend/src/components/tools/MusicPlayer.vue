<template>
  <div v-if="playerState" id="player">
    <div id="player_content">
      <div id="track">
        <img
          :src="
            playerState.item.is_local
              ? 'src/assets/images/local_file_icon.svg'
              : playerState.item.album.images[2].url
          "
          alt="album image"
        />
        <div id="track-info">
          <p>{{ playerState.item.name }}</p>
          <p>{{ playerState.item.artists.map((artist) => artist.name).join(', ') }}</p>
        </div>
        <div id="track-icons">
          <i v-if="playerState.item.is_local" class="fa-solid fa-triangle-exclamation"></i>
          <i v-else-if="isCurrentTrackLiked" class="fa-solid fa-heart" @click="unsaveTrack"></i>
          <i v-else class="fa-regular fa-heart" @click="saveTrack"></i>
          <i class="fa-regular fa-square-plus coming_soon"></i>
        </div>
      </div>
      <div id="player_buttons">
        <i
          :class="{
            'fa-solid fa-shuffle': true,
            'fa-xl': true,
            'animated-glow': playerState.smart_shuffle,
          }"
          :style="{
            color: playerState.shuffle_state ? '#1db9d2' : '',
          }"
          @click="toggleShuffle"
        ></i>

        <i class="fa-solid fa-backward-step fa-2xl" @click="skipToPrevious"></i>
        <i
          :class="playerState?.is_playing ? 'fa-solid fa-pause fa-2xl' : 'fa-solid fa-play fa-2xl'"
          @click="togglePlayer"
        ></i>
        <i class="fa-solid fa-forward-step fa-2xl" @click="skipToNext"></i>

        <i
          :class="{
            'fa-solid fa-repeat fa-xl': true,
            'animated-glow': playerState.repeat_state === 'context',
          }"
          :style="{ color: playerState.repeat_state != 'off' ? '#1db9d2' : 'white' }"
          @click="setRepeatMode"
        ></i>
      </div>
      <div id="tools">
        <i class="fa-solid fa-microphone-lines fa-1x coming_soon"></i>
        <i class="fa-solid fa-satellite-dish fa-1x coming_soon"></i>
        <i class="fa-solid fa-bars-staggered fa-1x"></i>
        <i
          :class="{
            'fa-solid fa-volume-off fa-1x': !playerState.device.supports_volume,
            'fa-solid fa-volume-xmark fa-1x':
              playerState.device.supports_volume && playerState.device.volume_percent == 0,
            'fa-solid fa-volume-low fa-1x':
              playerState.device.supports_volume &&
              playerState.device.volume_percent > 0 &&
              playerState.device.volume_percent < 75,
            'fa-solid fa-volume-high fa-1x':
              playerState.device.supports_volume && playerState.device.volume_percent >= 75,
          }"
          :style="{
            color: !playerState.device.supports_volume ? 'grey' : '',
            cursor: !playerState.device.supports_volume ? 'default' : 'pointer',
          }"
        ></i>
        <div id="volume" ref="volumeBarRef" @click="onVolumeBarClick">
          <div
            id="volume_percentage"
            :style="{
              width:
                (playerState.device.supports_volume ? playerState.device.volume_percent : '0') +
                '%',
            }"
          ></div>
        </div>
      </div>
    </div>
    <div id="time">
      <p id="current_time">{{ formatTime(playerState?.progress_ms || 0) }}</p>
      <div
        id="timebar"
        ref="timeBarRef"
        @mousemove="onMouseMove"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @click="onTimeBarClick"
      >
        <div id="progress" :style="{ width: getProgressPercentage + '%' }"></div>
        <transition name="fade">
          <div
            v-if="circleVisible"
            class="hover-circle"
            :style="{ left: hoverPosition + 'px' }"
          ></div>
        </transition>
        <transition name="fade">
          <div v-if="circleVisible" class="hover-tooltip" :style="{ left: hoverPosition + 'px' }">
            {{ hoverValue }}
          </div>
        </transition>
      </div>
      <p id="time_length">{{ formatTime(playerState?.item.duration_ms || 0) }}</p>
    </div>
    <MusicList />
  </div>
  <div v-else id="no_playerState">
    <p>Unable to display the player at the moment</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from 'vue'
import {
  fetchPlayerState,
  pausePlayback,
  playPlayback,
  skipNext,
  skipPrevious,
  isLiked,
  saveTracks,
  unsaveTracks,
  toggleShuffleState,
  setRepeatState,
  seekToPosition,
  setPlaybackVolume,
} from '@/services/musicPlayerService'
import type { PlayerState } from '@/types/request'
import MusicList from './MusicList.vue';

export default defineComponent({
  name: 'PlayerComponent',
  components: {
    MusicList
  },
  setup() {
    const playerState = ref<PlayerState | null>(null)
    const isCurrentTrackLiked = ref<Array<boolean> | null>(null)
    const playerInterval = ref<number | null>(null)
    const timeBarRef = ref<HTMLDivElement | null>(null)
    const volumeBarRef = ref<HTMLDivElement | null>(null)
    const hoverPosition = ref(0)
    const circleVisible = ref(false)

    const repeatModes = ['off', 'track', 'context']

    const getPlayerState = async () => {
      try {
        playerState.value = await fetchPlayerState()
        if (playerState.value.item != null && !playerState.value.item.is_local) {
          isCurrentTrackLiked.value = await isLiked([playerState.value.item.id])
        }
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
      if (!playerState.value?.device.is_restricted) {
        if (playerState.value?.is_playing) {
          await pausePlayback()
        } else {
          await playPlayback()
        }
      }
    }

    const skipToNext = async () => {
      if (!playerState.value?.device.is_restricted) {
        await skipNext()
      }
    }

    const skipToPrevious = async () => {
      if (!playerState.value?.device.is_restricted) {
        await skipPrevious()
      }
    }

    const saveTrack = async () => {
      if (playerState.value != null) {
        await saveTracks([playerState.value.item.id])
      }
    }

    const unsaveTrack = async () => {
      if (playerState.value != null) {
        await unsaveTracks([playerState.value.item.id])
      }
    }

    const toggleShuffle = async () => {
      if (!playerState.value?.device.is_restricted) {
        await toggleShuffleState(!playerState.value?.shuffle_state ? true : false)
      }
    }

    const setRepeatMode = async () => {
      if (!playerState.value?.device.is_restricted) {
        const nextState =
          repeatModes[
            (repeatModes.indexOf(
              playerState.value != null ? playerState.value?.repeat_state : 'off',
            ) +
              1) %
              repeatModes.length
          ]

        await setRepeatState(nextState)
      }
    }

    const onTimeBarClick = (event: MouseEvent) => {
      if (!timeBarRef.value || !playerState.value) return

      const rect = timeBarRef.value.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const percentage = (clickX / rect.width) * 100

      const newTime = Math.floor((percentage / 100) * playerState.value.item.duration_ms)

      seekToPosition(newTime)
    }

    const onVolumeBarClick = (event: MouseEvent) => {
      if (!volumeBarRef.value || !playerState.value) return

      const rect = volumeBarRef.value.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const percentage = (clickX / rect.width) * 100

      const newTime = Math.floor(percentage)

      setPlaybackVolume(newTime)
    }

    const onMouseEnter = () => {
      circleVisible.value = true
    }

    const onMouseLeave = () => {
      circleVisible.value = false
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!timeBarRef.value) return

      const rect = timeBarRef.value.getBoundingClientRect()
      const hoverX = event.clientX - rect.left

      hoverPosition.value = hoverX
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
      skipToNext,
      skipToPrevious,
      isCurrentTrackLiked,
      saveTrack,
      unsaveTrack,
      toggleShuffle,
      setRepeatMode,
      timeBarRef,
      onTimeBarClick,
      volumeBarRef,
      onVolumeBarClick,
      hoverPosition,
      circleVisible,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
      getProgressPercentage: computed(() => {
        const progress = playerState.value?.progress_ms || 0
        const duration = playerState.value?.item.duration_ms || 1
        return (progress / duration) * 100
      }),
      hoverValue: computed(() => {
        if (!timeBarRef.value || !playerState.value) return '0:00'

        const rect = timeBarRef.value.getBoundingClientRect()
        const percentage = (hoverPosition.value / rect.width) * 100

        const time = (percentage / 100) * playerState.value.item.duration_ms
        const minutes = Math.floor(time / 60000)
        const seconds = Math.floor((time % 60000) / 1000)

        return `${minutes}:${seconds.toString().padStart(2, '0')}`
      }),
      formatTime(ms: number) {
        let seconds = Math.floor(ms / 1000)
        const minutes = Math.floor(seconds / 60)
        seconds -= minutes * 60
        return minutes + ':' + ('0' + seconds).slice(-2)
      },
    }
  },
})
</script>

<style scoped>
@import url('@/assets/style/components/Player');
</style>
