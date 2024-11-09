import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  const env = loadEnv(mode, process.cwd())

  console.log('env -> ', env)
  return defineConfig({
    base: env.VITE_ENV === 'production' ? '/blog-admin' : '',
    server: {
      host: '0.0.0.0'
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        extensions: ['vue'],
        include: [/\.vue$/, /\.vue\?vue/],
        resolvers: [ElementPlusResolver()]
      })
    ],
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  })
}
