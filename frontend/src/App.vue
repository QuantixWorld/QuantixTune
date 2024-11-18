<template>
  <div id="app">
    <MainNavbar />
    <MusicPlayer v-if="isLoggedIn" />
    <router-view />
  </div>
</template>

<script lang="ts">
import MainNavbar from './components/tools/MainNavbar.vue'
import MusicPlayer from './components/tools/MusicPlayer.vue'

import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  name: 'App',
  components: {
    MainNavbar,
    MusicPlayer,
  },
  setup() {
    const isLoggedIn = ref(false);

    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth-status', { withCredentials: true });
        isLoggedIn.value = response.data.loggedIn;
      } catch (error) {
        isLoggedIn.value = false;
        console.error('Auth check failed:', error);
      }
    };

    onMounted(() => {
      checkAuthStatus();
    });

    return {
      isLoggedIn,
    };
  },
};
</script>

<style>
@import url('@/assets/style/global/App.css');
@import '@fortawesome/fontawesome-free/css/all.css';
</style>
