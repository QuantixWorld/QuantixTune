<template>
  <div id="playlist-comparer">
    <h2>Playlist Comparer</h2>
    <div id="pc_playlists">
      <div class="pc_selector">
        <div id="pc_playlist1" class="pc_playlist-display" @click="toggleDropdown(1)">
          <PlaylistDisplay :key="selectedPlaylist1.id" :playlist="selectedPlaylist1" class="pc_playlist" v-if="selectedPlaylist1" />
          <p class="button" v-else>Select</p>
        </div>
        <div id="pc_dropdown1" class="pc_dropdown scroll" v-if="dropdown1">
          <div class="dropdown_item" v-for="playlist in playlists" :key="playlist.id" @click.stop="selectPlaylist(1, playlist)">
            <PlaylistDisplay
              :playlist="playlist" class="pc__dropdown_playlist" />
          </div>
        </div>
      </div>
      <p class="button" :class="{
        'disabled': dropdown1 || dropdown2 || !selectedPlaylist1 || !selectedPlaylist2 || selectedPlaylist1.id === selectedPlaylist2.id
      }"
      @click="comparePlaylists">Compare</p>
      <div class="pc_selector">
        <div id="pc_playlist2" class="pc_playlist-display" @click="toggleDropdown(2)">
          <PlaylistDisplay :key="selectedPlaylist2.id" :playlist="selectedPlaylist2" class="pc_playlist" v-if="selectedPlaylist2" />
          <p class="button" v-else>Select</p>
        </div>
        <div id="pc_dropdown2" class="pc_dropdown scroll" v-if="dropdown2">
          <div class="dropdown_item" v-for="playlist in playlists" :key="playlist.id" @click.stop="selectPlaylist(2, playlist)">
            <PlaylistDisplay
              :playlist="playlist" class="pc__dropdown_playlist" />
          </div>
        </div>
      </div>
    </div>
    <div id="pc_results">
      <h3>Results</h3>
      <div id="pc_results_tracks">
        <div id="only_in1" class="pc_results-row scroll">
          <TrackDisplay v-for="playlistTrack in trackUniqueToPlaylist1" :key="playlistTrack.id" :track="playlistTrack.track" />
        </div>
        <div id="only_in2" class="pc_results-row scroll">
          <TrackDisplay v-for="playlistTrack in trackUniqueToPlaylist2" :key="playlistTrack.id" :track="playlistTrack.track" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import PlaylistDisplay from './PlaylistDisplay.vue';
import type { SimplifiedPlaylist, PlaylistTrack } from '@/types';
import { fetchUserPlaylists, fetchTracksFromPlaylist } from '@/services/playlistService';
import TrackDisplay from './TrackDisplay.vue';

export default defineComponent({
  name: 'PlaylistComparer',
  components: {
    PlaylistDisplay,
    TrackDisplay
  },
  setup() {
    const playlists = ref<Array<SimplifiedPlaylist> | null>(null);

    const dropdown1 = ref(false);
    const dropdown2 = ref(false);

    const selectedPlaylist1 = ref<SimplifiedPlaylist | null>(null);
    const selectedPlaylist2 = ref<SimplifiedPlaylist | null>(null);

    const trackInPlaylist1 = ref<Array<PlaylistTrack> | null>(null);
    const trackInPlaylist2 = ref<Array<PlaylistTrack> | null>(null);

    const trackUniqueToPlaylist1 = ref<Array<PlaylistTrack> | null>(null);
    const trackUniqueToPlaylist2 = ref<Array<PlaylistTrack> | null>(null);

    const playerInterval = ref<number | null>(null);

    const toggleDropdown = (index: number) => {
      if (index === 1) {
        dropdown1.value = !dropdown1.value;
      } else {
        dropdown2.value = !dropdown2.value;
      }
    }

    const selectPlaylist = (index: number, playlist: SimplifiedPlaylist) => {
      toggleDropdown(index);
      if (index === 1) {
        selectedPlaylist1.value = playlist;
      } else {
        selectedPlaylist2.value = playlist;
      }
    }

    const getPlaylists = async () => {
      playlists.value = await fetchUserPlaylists();

    }

    const comparePlaylists = async () => {
      if (!selectedPlaylist1.value || !selectedPlaylist2.value) return;

      trackInPlaylist1.value = null
      trackInPlaylist2.value = null
      trackUniqueToPlaylist1.value = null
      trackUniqueToPlaylist2.value = null

      trackInPlaylist1.value = await fetchTracksFromPlaylist(selectedPlaylist1.value.id);
      trackInPlaylist2.value = await fetchTracksFromPlaylist(selectedPlaylist2.value.id);

      trackUniqueToPlaylist1.value = trackInPlaylist1.value?.filter(
        track1 => !trackInPlaylist2.value?.some(track2 => track2.track.id === track1.track.id)
      );

      trackUniqueToPlaylist2.value = trackInPlaylist2.value?.filter(
        track2 => !trackInPlaylist1.value?.some(track1 => track1.track.id === track2.track.id)
      );
    }

    const startPolling = () => {
      getPlaylists()

      stopPolling()

      playerInterval.value = setInterval(() => {
        getPlaylists()
      }, 5000)
    }

    const stopPolling = () => {
      if (playerInterval.value !== null) {
        clearInterval(playerInterval.value)
        playerInterval.value = null
      }
    }

    onMounted(() => {
      startPolling();
    });

    onBeforeUnmount(() => {
      stopPolling();
    });

    return {
      playlists,
      toggleDropdown,
      dropdown1,
      dropdown2,
      selectPlaylist,
      selectedPlaylist1,
      selectedPlaylist2,
      comparePlaylists,
      trackUniqueToPlaylist1,
      trackUniqueToPlaylist2
    }
  },
})
</script>

<style scoped>
@import url('../../assets/style/components/PlaylistComparer.css');
</style>
