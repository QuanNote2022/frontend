/**
 * Vite 配置文件
 * 配置Vite构建工具的各项参数
 */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import { mockServerPlugin } from './mock'

/**
 * 定义Vite配置
 * @param mode 运行模式
 */
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  // 是否启用Mock服务
  const enableMock = env.VITE_ENABLE_MOCK === 'true'

  return {
    /**
     * 插件配置
     */
    plugins: [
      vue(), // Vue插件
      AutoImport({
        resolvers: [ElementPlusResolver()], // 自动导入Element Plus组件
        imports: ['vue', 'vue-router', 'pinia'], // 自动导入的库
        dts: 'src/auto-imports.d.ts', // 生成类型声明文件
      }),
      Components({
        resolvers: [ElementPlusResolver()], // 自动注册Element Plus组件
        dts: 'src/components.d.ts', // 生成组件类型声明文件
      }),
      ...(enableMock ? [mockServerPlugin()] : []), // 启用Mock服务
    ],
    /**
     * 路径解析配置
     */
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 别名配置
      },
    },
    /**
     * 开发服务器配置
     */
    server: {
      port: 5173, // 开发服务器端口
      ...(enableMock
        ? {} // 启用Mock时不配置代理
        : {
            proxy: {
              '/api': {
                target: 'http://localhost:8080', // 后端API地址
                changeOrigin: true, // 更改源
              },
            },
          }),
    },
    /**
     * CSS配置
     */
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/variables" as *;\n`, // 全局SCSS变量
        },
      },
    },
  }
})
