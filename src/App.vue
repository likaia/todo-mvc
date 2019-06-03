<template>
    <div id="app">
        <sideMenu/>
        <router-view/>
    </div>
</template>

<script>
    import sideMenu from './components/sideMenu.vue'

    export default {
        name: 'app',
        components: {
            sideMenu
        },
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style lang="scss">
    * {
        margin: 0;
        padding: 0;
    }

    body {
        background: #f5f5f5;
        color: #4d4d4d;
        font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        position: relative;
    }
</style>
