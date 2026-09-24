import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { OutputAsset } from 'rollup';

const input = {
  main: resolve(__dirname, 'src/main.tsx'),
  standalone: resolve(__dirname, 'src/standalone.tsx'),
  arenaWorker: resolve(__dirname, 'src/arenaWorker.ts')
};

export default defineConfig({
  resolve: {
    alias: {
      'react-mdl': 'react-mdl/lib/index.js',
      '@sourcer/core': resolve(__dirname, '../../packages/core/src')
    }
  },
  plugins: [
    react({
      jsxRuntime: 'classic',
      include: [/\.tsx?$/, /\.jsx?$/, /node_modules\/react-mdl\/.+\.js$/]
    })
  ],
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, '../../docs'),
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      input,
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo: OutputAsset) => {
          if (assetInfo.name) {
            const filename = assetInfo.name.split(/[/\\]/).pop();
            if (filename) {
              return filename;
            }
          }
          return 'assets/[name][extname]';
        }
      }
    }
  },
  optimizeDeps: {
    include: ['brace', 'brace/mode/javascript', 'brace/theme/chrome']
  }
});
