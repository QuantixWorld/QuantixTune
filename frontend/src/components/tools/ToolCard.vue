<template>
  <div class="tool-card">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <router-link :to="route" class="button">Open Tool</router-link>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

// Define props directly using defineProps
const props = defineProps<{
  title: string
  description: string
  route: string
}>()

// Destructure props for easier use in the template
const { title, description, route } = props
</script>

<style scoped>
@import url('@/assets/style/components/ToolCard.css');
</style>
