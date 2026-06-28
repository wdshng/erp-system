import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 引入路由
import router from './router'

// 引入全局样式
import './style.css'

import App from './App.vue'

// 创建 Vue 应用实例
const app = createApp(App)

// 注册 Pinia 状态管理
app.use(createPinia())

// 注册 Vue Router
app.use(router)

// 挂载应用到 #app
app.mount('#app')
