<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/tools/Navbar.vue";

export default {
  components: {
    Navbar,
  },
};
</script>

<style>
@import './assets/styles/App.css';
@import '@fortawesome/fontawesome-free/css/all.css';
</style>