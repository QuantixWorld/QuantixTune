const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pwa: {
    name: 'Spotify Tool',
    themeColor: '#1DB9D2',
    msTileColor: '#ffffff',
    manifestOptions: {
      background_color: '#ffffff',
    },
    workboxOptions: {
      exclude: [/_redirects/]
    }
  }
})