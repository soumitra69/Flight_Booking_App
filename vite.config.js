import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: [
      '.web.jsx',
      '.web.js',
      '.web.tsx',
      '.web.ts',
      '.jsx',
      '.js',
      '.tsx',
      '.ts',
      '.json',
    ],
  },
  define: {
    global: 'window',
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: [
        '.web.jsx',
        '.web.js',
        '.jsx',
        '.js',
        '.ts',
        '.tsx',
      ],
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
