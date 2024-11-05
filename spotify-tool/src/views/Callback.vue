<template>
    <div class="callback">
        Redirecting...
    </div>
</template>

<script>
import { exchangeCodeForToken } from '../services/auth'

export default {
    async created() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const storedState = localStorage.getItem('spotify_auth_state');

        if (state === storedState) {
            localStorage.removeItem('spotify_auth_state');
            await exchangeCodeForToken(code);
        } else {
            console.error("State mismatch. Authentication failed.");
        }
    }
}
</script>