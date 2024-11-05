<template>
    <div class="tool-card">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
        <router-link :to="route" class="button">Open Tool</router-link>
    </div>
</template>

<script>
export default {
    name: "ToolCard",
    props: {
        title: String,
        descrption: String,
        route: String
    }
}
</script>

<style scoped>
@import '../../assets/styles/components/ToolCard.css';
</style>