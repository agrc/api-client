import { defineConfig } from 'vite';
import { markBuildAsCommonJs } from './vite.plugins';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [markBuildAsCommonJs()],
});
