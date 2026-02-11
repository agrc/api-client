import { defineConfig } from 'vite';
import { viteStaticCopy } from './vendor/vite-plugin-static-copy.cjs';
// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    // @ts-expect-error - vite-plugin-static-copy types are incomplete
    viteStaticCopy({
      targets: [
        { src: './src/assets/*', dest: 'assets' },
        // Explicitly include licenses.txt in case glob misses it
        { src: './src/assets/licenses.txt', dest: 'assets' },
      ],
    }),
  ],
});
