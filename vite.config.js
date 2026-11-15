import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

const rootDir = import.meta.dirname || process.cwd();

// Include existing html tools in build input so they continue to work
const htmlEntries = {
  main: resolve(rootDir, 'index.html'),
};

try {
  const files = fs.readdirSync(rootDir);
  files.forEach((file) => {
    if (file.endsWith('.html') && file !== 'index.html') {
      const key = file.replace(/\.html$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      htmlEntries[key] = resolve(rootDir, file);
    }
  });
} catch (e) {
  console.warn('Could not scan HTML files for rollup input:', e);
}

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: htmlEntries,
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
