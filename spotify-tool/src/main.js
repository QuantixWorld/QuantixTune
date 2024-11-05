import { createApp } from 'vue'
import router from './router/index'
import App from './App.vue'
import './registerServiceWorker'

createApp(App)
    .use(router)
    .mount('#app')