<template>
  <div id="app">
    <MainNavbar />
    <MusicPlayer />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import MainNavbar from './components/tools/MainNavbar.vue'
import MusicPlayer from './components/tools/MusicPlayer.vue'
</script>

<style>
@import url('@/assets/style/global/App.css');
@import '@fortawesome/fontawesome-free/css/all.css';
</style>
