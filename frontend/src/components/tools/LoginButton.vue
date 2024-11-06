<template>
  <button @click="login">Login with Spotify</button>
</template>

<script setup lang="ts">
import { login } from '../../composables/tools/useLoginButtonProps'
</script>
