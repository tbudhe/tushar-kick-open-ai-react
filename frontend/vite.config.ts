import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
      '/heartbeat': 'http://localhost:3000',
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../dist/build'),
    emptyOutDir: true,
  },
});
