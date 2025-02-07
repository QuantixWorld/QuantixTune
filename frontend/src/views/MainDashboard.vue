<template>
  <div class="dashboard">
    <h1>Welcome to Quantix Tune</h1>
    <p>Explore tools linked to Spotify!</p>

    <div class="tool-list" v-if="authStore.isLoggedIn">
      <!--<ToolCard
        v-for="tool in tools"
        :key="tool.id"
        :title="tool.title"
        :description="tool.description"
        :route="tool.route"
      />-->
      <PlaylistComparer />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlaylistComparer from '@/components/tools/PlaylistComparer.vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>

<style scoped>
@import url('../assets/style/views/Dashboard.css');
</style>
