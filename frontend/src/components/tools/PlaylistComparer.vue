<template>
  <div id="playlist-comparer">
    <h2>Playlist Comparer</h2>
    <div id="pc_playlists">
      <div id="pc_playlist1" class="pc_playlist-display" @click="getPlaylists" >
        <PlaylistDisplay img="@/assets/images/local_file_icon.svg" title="Title of the playlist" class="pc_playlist" />
      </div>
      <p class="button">Compare</p>
      <div id="pc_playlist2" class="pc_playlist-display" @click="getPlaylists" >
        <PlaylistDisplay img="@/assets/images/local_file_icon.svg" title="Title of the playlist" class="pc_playlist" />
      </div>
    </div>
    <div id="pc_results">
      <h3>Results</h3>
      <div id="pc_results_playlists">
        <div id="only_in1" v-if="playlists?.items?.length">
          <PlaylistDisplay v-for="playlist in playlists?.items" :key="playlist.id"
          :img="playlist.images[2] ? playlist.images[2].url : playlist.images[0] ? playlist.images[0]?.url : '@/assets/images/default_icon.svg'" :title="playlist.name" class="pc_playlist-list" />
        </div>
        <div id="only_in2">
          <PlaylistDisplay v-for="playlist in playlists?.items" :key="playlist.id"
            :img="playlist.images[2] ? playlist.images[2].url : playlist.images[0] ? playlist.images[0]?.url : '@/assets/images/default_icon.svg'" :title="playlist.name" class="pc_playlist-list" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PlaylistDisplay from './PlaylistDisplay.vue';
import type { Playlists } from '@/types';
import { fetchUserPlaylists } from '@/services/playlistService';

export default defineComponent({
  name: 'PlaylistComparer',
  components: {
    PlaylistDisplay
  },
  setup() {
    const playlists = ref<Playlists | null>(null)

    const getPlaylists = async () => {
      playlists.value = await fetchUserPlaylists();
      console.log(playlists.value);
    }

    return {
      playlists,
      getPlaylists
    }
  },
})
</script>

<style scoped>
@import url('../../assets/style/components/PlaylistComparer.css');
</style>
