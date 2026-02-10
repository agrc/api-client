import { defineConfig } from 'vite';
import { viteStaticCopy } from './vendor/vite-plugin-static-copy.cjs';
// https://vitejs.dev/config
export default defineConfig({
  plugins: [viteStaticCopy({ targets: [{ src: './src/assets/*', dest: 'assets' }] })],
  build: {
    rollupOptions: {
      external: ['generate-license-file'],
    },
  },
});
