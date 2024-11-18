<template>
  <div id="app">
    <MainNavbar />
    <MusicPlayer v-if="authStore.isLoggedIn" />
    <LogoutButton v-if="authStore.isLoggedIn" />
    <LoginButton v-if="!authStore.isLoggedIn" />
    <router-view />
  </div>
</template>

<script lang="ts">
import LogoutButton from './components/tools/LogoutButton.vue';
import LoginButton from './components/tools/LoginButton.vue';
import MainNavbar from './components/tools/MainNavbar.vue'
import MusicPlayer from './components/tools/MusicPlayer.vue'
import { useAuthStore } from './stores/authStore';

import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  name: 'App',
  components: {
    MainNavbar,
    MusicPlayer,
    LoginButton,
    LogoutButton,
  },
  setup() {
    const authStore = useAuthStore();

    onMounted(() => {
      authStore.checkAuthStatus();
    });

    return {
      authStore,
    };
  },
};
</script>

<style>
@import url('@/assets/style/global/App.css');
@import '@fortawesome/fontawesome-free/css/all.css';
</style>
