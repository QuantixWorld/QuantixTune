<template>
  <div class="dashboard">
    <h1>Welcome to Quantix Tune</h1>
    <p>Explore tools linked to Spotify!</p>

    <div class="tool-list" v-if="authStore.isLoggedIn">
      <PlaylistComparer />
    </div>
  </div>
</template>

<script lang="ts">
import PlaylistComparer from '@/components/tools/PlaylistComparer.vue';
import { useAuthStore } from '@/stores/authStore';
import { defineComponent } from 'vue';

export default defineComponent ({
  name: 'DashboardView',
  components: {
    PlaylistComparer
  },
  setup() {
    const authStore = useAuthStore();

    return {
      authStore
    }
  }
})
</script>

<style scoped>
@import url('../assets/style/views/Dashboard.css');
</style>
