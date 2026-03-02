import {createApp,provide } from 'vue'
import router from '@/router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import request from './utils/request'


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }


provide('request', request)
app.provide('request', request)
app.use(router)
app.use(ElementPlus)
app.mount("#app")