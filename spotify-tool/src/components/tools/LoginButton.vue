<template>
    <button @click="login">
        Login with Spotify
    </button>
</template>

<script>
import { getSpotifyAuthUrl } from '../../services/auth'

export default {
    methods: {
        login() {
            window.location.href = getSpotifyAuthUrl();
        }
    }
}
</script>