import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入中国风全局样式
import './styles/chinese.css'

const app = createApp(App)
app.use(router).use(ElementPlus).mount('#app')
