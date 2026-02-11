import { defineConfig } from 'vite';
import { viteStaticCopy } from './vendor/vite-plugin-static-copy.cjs';
// https://vitejs.dev/config
export default defineConfig({
  // @ts-expect-error - vite-plugin-static-copy types are incomplete
  plugins: [viteStaticCopy({ targets: [{ src: './src/assets/*', dest: 'assets' }] })],
});
