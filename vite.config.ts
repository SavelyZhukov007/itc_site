import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    react(),
    // 1. Сжатие изображений (до встраивания)
    ViteImageOptimizer({
      png: {
        quality: 80,               // Степень сжатия PNG (0-100)
      },
      jpeg: {
        quality: 80,               // Степень сжатия JPEG
      },
      jpg: {
        quality: 80,
      },
      webp: {
        lossless: true,            // Сжатие WebP без потерь (если используются)
      },
      svg: {
        multipass: true,
        plugins: ['preset-default'], // Стандартная оптимизация SVG
      },
    }),
    // 2. Сборка всего в один HTML-файл
    viteSingleFile({
      // Используем glob-шаблоны вместо RegExp
      inlinePattern: ['**/*.js', '**/*.css', '**/*.mjs', '**/*.woff2?', '**/*.svg'],
      deleteInlinedFiles: true,
      removeViteModuleLoader: true,
      useRecommendedBuildConfig: true,
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Встраиваем все изображения из src/assets (Base64)
    // Установите лимит больше максимального размера вашей картинки,
    // например 20 МБ, чтобы все они гарантированно встроились.
    assetsInlineLimit: 1024 * 1024 * 20, // 20 MB
  },
});