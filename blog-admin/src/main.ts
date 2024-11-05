import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { install } from '@icon-park/vue-next/es/all'
import '@icon-park/vue-next/styles/index.css'

const app = createApp(App)
const pinia = createPinia()
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

install(app)

app.use(pinia).use(router).mount('#app')
