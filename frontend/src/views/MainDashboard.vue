<template>
  <div class="dashboard">
    <h1>Welcome to Spotify Tool</h1>
    <p>Explore tools to manage and analyze your Spotify playlists</p>

    <div class="tool-list">
      <ToolCard
        v-for="tool in tools"
        :key="tool.id"
        :title="tool.title"
        :description="tool.description"
        :route="tool.route"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ToolCard from '../components/tools/ToolCard.vue'
import { tools } from '../composables/views/MainDashboardData'

console.log(tools) // Log tools to check values
</script>

<style scoped>
@import url('../assets/style/views/Dashboard.css');
</style>
