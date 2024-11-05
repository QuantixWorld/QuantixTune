<template>
    <div class="dashboard">
        <h1>Welcome to Spotify Tool</h1>
        <p>Explore tools to manage and analyse your Spotify playlists</p>

        <div class="tool-list">
            <ToolCard
                v-for="tool in tools"
                :key="tool.id"
                :title="tool.title"
                :descrption="tool.description"
                :route="tool.route"
            />
        </div>
    </div>
</template>

<script>
import ToolCard from '../components/tools/ToolCard.vue'

export default {
    name: 'main-dashboard',
    components: {
        ToolCard
    },
    data() {
        return {
            tools: [
                { id: 1, title: 'Duplicate Detector', description: 'Find duplicates in playlist', routes: '/duplicate-detector' },
                { id: 2, title: 'Playlist comparison', description: 'Compare playlists side by side', routes: '/playlist-comparison' },
                { id: 3, title: 'Playlist analyzer', description: 'Analyze playlist characteristics', routes: '/playlist-analyzer' }
            ]
        }
    }
}
</script>

<style scoped>
@import '../assets/styles/views/Dashboard.css';
</style>