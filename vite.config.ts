import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: {
        quality: 80,            
      },
      jpeg: {
        quality: 80,      
      },
      jpg: {
        quality: 80,
      },
      webp: {
        lossless: true, 
      },
      svg: {
        multipass: true,
        plugins: ['preset-default'],
      },
    }),
    viteSingleFile({
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
    assetsInlineLimit: 1024 * 1024 * 20
  },
});