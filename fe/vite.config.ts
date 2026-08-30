import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

const src = path.resolve(__dirname, './src')

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': src,
      '@api': path.resolve(src, 'api'),
      '@assets': path.resolve(src, 'assets'),
      '@components': path.resolve(src, 'components'),
      '@config': path.resolve(src, 'config'),
      '@constants': path.resolve(src, 'constants'),
      '@features': path.resolve(src, 'features'),
      '@hooks': path.resolve(src, 'hooks'),
      '@lib': path.resolve(src, 'lib'),
      '@messages': path.resolve(src, 'messages'),
      '@pages': path.resolve(src, 'pages'),
      '@app-types': path.resolve(src, 'types'),
    },
  },
})
