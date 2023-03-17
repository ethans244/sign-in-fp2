import { defineConfig } from 'vite'
import { resolve } from 'path'


export default {
  base: '/sign-in-fp2/',
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'App.html'),
      },
    }
  }
}