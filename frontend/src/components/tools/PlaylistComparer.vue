<template>
    <div id="playlist-comparer">
        <h2>Playlist Comparer</h2>
        <div id="pc_playlists">
            <div id="pc_playlist1" class="pc_playlist-display">
                <img src="@/assets/images/local_file_icon.svg" alt="Local file icon">
                <div id="pc_playlist-info">
                    <p>Title of the playlist</p>
                </div>
            </div>
            <p class="button">Compare</p>
            <div id="pc_playlist2" class="pc_playlist-display">
                <img src="@/assets/images/local_file_icon.svg" alt="Local file icon">
                <div id="pc_playlist-info">
                    <p>Title of the playlist</p>
                </div>
            </div>
        </div>
        <h3>Results</h3>
        <div id="pc_results">
            <div id="only_in1" v-if="localPlaylists?.length">
                <PlaylistDisplay id="pc_playlist1"
                    v-for="playlist in localPlaylists"
                    :key="playlist.id"
                    :img="playlist.img"
                    :title="playlist.title" />
            </div>
            <p v-else>Loading playlists...</p>
            <div id="only_in2">
                <img src="@/assets/images/local_file_icon.svg" alt="Local file icon">
                <div id="pc_playlist-info">
                    <p>Title of the playlist</p>
                </div>
                <img src="@/assets/images/local_file_icon.svg" alt="Local file icon">
                <div id="pc_playlist-info">
                    <p>Title of the playlist</p>
                </div>
                <img src="@/assets/images/local_file_icon.svg" alt="Local file icon">
                <div id="pc_playlist-info">
                    <p>Title of the playlist</p>
                </div>
                <img src="@/assets/images/local_file_icon.svg" alt="Local file icon">
                <div id="pc_playlist-info">
                    <p>Title of the playlist</p>
                </div>
                <img src="@/assets/images/local_file_icon.svg" alt="Local file icon">
                <div id="pc_playlist-info">
                    <p>Title of the playlist</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import PlaylistDisplay from './PlaylistDisplay.vue';
import { playlists } from '@/composables/views/MainDashboardData';

const localPlaylists = ref(playlists)
console.log(localPlaylists)

export default defineComponent({
    name: 'PlaylistComparer',
})
</script>

<style scoped>
@import url('../../assets/style/components/PlaylistComparer.css');
</style>
