<template>
  <div class="navbar">
    <ul>
      <li v-for="(item, index) in navItems" :key="index">
        <router-link :to="item.link">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { navItems } from '../../composables/tools/NavbarData'
</script>

<style scoped>
@import url('@/assets/style/components/Navbar.css');
</style>
