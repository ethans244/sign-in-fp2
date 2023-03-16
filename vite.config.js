import { defineConfig } from 'vite'
import { resolve } from 'path'


export default {
  base: '/sign-in-fp2/',

  rollupOptions: {
    input: {
      main: resolve(__dirname, '../index.html/'),
      app: resolve(__dirname, 'app.html'),
    },
  }
}