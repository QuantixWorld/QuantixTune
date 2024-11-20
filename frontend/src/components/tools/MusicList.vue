<template>
  <div ref="scrollContainerRef" id="music-list">
    <div id="recently-played" class="section">
      <div class="track" v-for="(track, index) in recentlyPlayed" :key="index">
        <img :src="track.image" alt="Track Image" class="track-image" />
        <div class="track-details">
          <p class="track-title">{{ track.title }}</p>
          <p class="track-artists">{{ track.artists.join(', ') }}</p>
        </div>
      </div>
    </div>
    <h3>Recently Played</h3>
    <div class="track current-track">
      <img :src="currentTrack.image" alt="Track Image" class="track-image" />
      <div class="track-details">
        <p class="track-title">{{ currentTrack.title }}</p>
        <p class="track-artists">{{ currentTrack.artists.join(', ') }}</p>
      </div>
    </div>
    <h3>Queue</h3>
    <div id="queue" class="section">
      <div class="track" v-for="(track, index) in queue" :key="index">
        <img :src="track.image" alt="Track Image" class="track-image" />
        <div class="track-details">
          <p class="track-title">{{ track.title }}</p>
          <p class="track-artists">{{ track.artists.join(', ') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'MusicList',
  setup() {
    const scrollContainerRef = ref<HTMLDivElement | null>(null)

    onMounted(() => {
      if (scrollContainerRef.value) {
        scrollContainerRef.value.scrollTop = 
          (scrollContainerRef.value.scrollHeight - scrollContainerRef.value.clientHeight) / 2
      }
    })

    return {
      scrollContainerRef
    }
  },
  data() {
    return {
      recentlyPlayed: [
        {
          image: 'src/assets/images/local_file_icon.svg',
          title: 'Track 1',
          artists: ['Artist A', 'Artist B'],
        },
        { image: 'src/assets/images/local_file_icon.svg', title: 'Track 2', artists: ['Artist C'] },
        {
          image: 'src/assets/images/local_file_icon.svg',
          title: 'Track 1',
          artists: ['Artist A', 'Artist B'],
        },
        { image: 'src/assets/images/local_file_icon.svg', title: 'Track 2', artists: ['Artist C'] },
        {
          image: 'src/assets/images/local_file_icon.svg',
          title: 'Track 1',
          artists: ['Artist A', 'Artist B'],
        },
        { image: 'src/assets/images/local_file_icon.svg', title: 'Track 2', artists: ['Artist C'] },
      ],
      currentTrack: {
        image: 'src/assets/images/local_file_icon.svg',
        title: 'Current Track',
        artists: ['Artist D'],
      },
      queue: [
        { image: 'src/assets/images/local_file_icon.svg', title: 'Track 3', artists: ['Artist E'] },
        {
          image: 'src/assets/images/local_file_icon.svg',
          title: 'Track 4',
          artists: ['Artist F', 'Artist G'],
        },
        {
          image: 'src/assets/images/local_file_icon.svg',
          title: 'Track 1',
          artists: ['Artist A', 'Artist B'],
        },
        { image: 'src/assets/images/local_file_icon.svg', title: 'Track 2', artists: ['Artist C'] },
        {
          image: 'src/assets/images/local_file_icon.svg',
          title: 'Track 1',
          artists: ['Artist A', 'Artist B'],
        },
        { image: 'src/assets/images/local_file_icon.svg', title: 'Track 2', artists: ['Artist C'] },
      ],
    }
  },
})
</script>

<style scoped>
@import url('../../assets/style/components/MusicList.css');
</style>
