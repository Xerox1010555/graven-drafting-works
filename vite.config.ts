import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { analyzer } from 'vite-bundle-analyzer';
import path from 'path';
import alias from '@rollup/plugin-alias';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    mode === 'analyze' && analyzer({ analyzerMode: 'static', openAnalyzer: true }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@components/ui': path.resolve(__dirname, './src/components/ui/index.ts'),
      '@components/layout': path.resolve(__dirname, './src/components/layout/index.ts'),
      '@components/reel': path.resolve(__dirname, './src/components/reel/index.ts'),
      '@components/forms': path.resolve(__dirname, './src/components/forms/index.ts'),
      '@hooks': path.resolve(__dirname, './src/hooks/index.ts'),
      '@utils': path.resolve(__dirname, './src/utils/index.ts'),
      '@data': path.resolve(__dirname, './src/data/index.ts'),
      '@types': path.resolve(__dirname, './src/types/index.ts'),
      '@styles': path.resolve(__dirname, './src/styles/globals.css'),
      '@pages': path.resolve(__dirname, './src/pages/pages.ts'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    cssCodeSplit: true,
    sourcemap: mode !== 'production',
    rollupOptions: {
      plugins: [
        alias({
          entries: [
            { find: '@', replacement: path.resolve(__dirname, './src') },
            { find: '@components', replacement: path.resolve(__dirname, './src/components') },
            { find: '@components/ui', replacement: path.resolve(__dirname, './src/components/ui/index.ts') },
            { find: '@components/layout', replacement: path.resolve(__dirname, './src/components/layout/index.ts') },
            { find: '@components/reel', replacement: path.resolve(__dirname, './src/components/reel/index.ts') },
            { find: '@components/forms', replacement: path.resolve(__dirname, './src/components/forms/index.ts') },
            { find: '@hooks', replacement: path.resolve(__dirname, './src/hooks/index.ts') },
            { find: '@utils', replacement: path.resolve(__dirname, './src/utils/index.ts') },
            { find: '@data', replacement: path.resolve(__dirname, './src/data/index.ts') },
            { find: '@types', replacement: path.resolve(__dirname, './src/types/index.ts') },
            { find: '@styles', replacement: path.resolve(__dirname, './src/styles/globals.css') },
            { find: '@pages', replacement: path.resolve(__dirname, './src/pages/pages.ts') },
          ],
        }),
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          video: ['hls.js'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|avif|woff2?)$/.test(assetInfo.name)) {
            return `assets/media/[name]-[hash].${ext}`;
          }
          if (/\.css$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  server: {
    port: 3000,
    host: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  },
}));