// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import VueRouter from 'unplugin-vue-router/vite'

// Utilities
import {defineConfig} from 'vite'
import {fileURLToPath, URL} from 'node:url'

const authTargetUrl = "http://127.0.0.1:8888"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter(),
    Vue({
      template: {transformAssetUrls},
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Components(),
    ViteFonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          },
        ],
      },
    }),
  ],
  define: {'process.env': {}},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
    proxy: {
      // 监听 /login 请求并进行重定向处理
      "/login": {
        target: authTargetUrl,
        changeOrigin: true,
      },
      "/oauth2": {
        target: authTargetUrl,
        changeOrigin: true,
      },
      "/assets": {
        target: authTargetUrl,
        changeOrigin: true,
      },
      "/api/authorization": {
        target: authTargetUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/authorization/, ""),
      },
      "/api/flowable": {
        target: "http://127.0.0.1:5555",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/flowable/, ""),
      },
      "/api/dispatch": {
        target: "http://127.0.0.1:7777",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dispatch/, ""),
      },
      "/api/ai": {
        target: "http://127.0.0.1:9999",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai/, ""),
      },
      "/testSession": {
        target: "http://127.0.0.1:3333",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/testSession/, ""),
      },
      "/api/tools": {
        target: "http://127.0.0.1:2222",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tools/, ""),
      },
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
      },
    },
  },
})
