import { defineConfig } from 'vite';
import { emitMainProcessAssets, markBuildAsCommonJs } from './vite.plugins';
// https://vitejs.dev/config
export default defineConfig({
  plugins: [markBuildAsCommonJs(), emitMainProcessAssets()],
});
