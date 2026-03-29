import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import { mockServerPlugin } from './mock'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const enableMock = env.VITE_ENABLE_MOCK === 'true'

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
      }),
      ...(enableMock ? [mockServerPlugin()] : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 5173,
      ...(enableMock
        ? {}
        : {
            proxy: {
              '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
              },
            },
          }),
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/variables" as *;\n`,
        },
      },
    },
  }
})
