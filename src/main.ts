/**
 * 应用入口文件
 * 初始化Vue应用，配置插件和全局组件
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './assets/styles/global.scss'

/**
 * 创建Vue应用实例
 */
const app = createApp(App)

/**
 * 注册所有Element Plus图标
 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

/**
 * 应用插件
 */
app.use(createPinia()) // 状态管理
app.use(router) // 路由
app.use(ElementPlus, { locale: zhCn }) // UI组件库（中文本地化）

/**
 * 挂载应用到DOM
 */
app.mount('#app')
