import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from './vendor/vite-plugin-static-copy.cjs';
// https://vitejs.dev/config
export default defineConfig({
  plugins: [tailwindcss(), viteStaticCopy({ targets: [{ src: './src/assets/*', dest: 'assets' }] })],
});
