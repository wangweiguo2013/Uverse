import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
      alias: {
          '@': resolve(__dirname, './src'), // 设置 `@` 指向 `src` 目录
      },
  },
  base: './', // 设置打包路径
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@import "./src/scss/const.scss";` },
    },
  },
  build:{
    outDir: 'build',
    rollupOptions: {
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        }
    }
  }
})
