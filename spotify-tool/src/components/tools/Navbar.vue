<template>
  <div class="navbar">
    <ul>
      <li v-for="(item, index) in navItems" :key="index">
        <router-link :to="route">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "main-navbar",
  data() {
    return {
      navItems: [
        { name: "Home", link: "/", icon: "fas fa-home" },
        { name: "Duplicate", link: "/duplicate-detector", icon: "fa-solid fa-copy" },
        { name: "Comparison", link: "/playlist-comparison", icon: "fa-solid fa-not-equal" },
        { name: "Analyzer", link: "/playlist-analyzer", icon: "fa-solid fa-chart-simple" },
      ],
    };
  },
};
</script>

<style scoped>
@import '../../assets/styles/components/Navbar.css';
</style>
