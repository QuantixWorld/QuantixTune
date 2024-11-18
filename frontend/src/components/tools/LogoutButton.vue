<template>
  <button @click="authStore.logout">Logout</button>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/authStore';

export default {
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
};
</script>
