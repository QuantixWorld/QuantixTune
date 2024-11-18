<template>
  <button @click="login">Login</button>
</template>

<script lang="ts">
export default {
  setup() {
    const login = () => {
      window.location.href = 'http://localhost:3000/login'
    }

    return {
      login
    }
  }
}

</script>
