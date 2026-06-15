import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

const assetsDirectory = path.resolve(__dirname, 'src', 'assets');

// Electron Forge emits the main and preload bundles as CommonJS into .vite/build,
// so this nested package.json keeps Electron from treating those .js files as ESM.
export const markBuildAsCommonJs = (): Plugin => ({
  name: 'mark-build-as-commonjs',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'package.json',
      source: '{"type":"commonjs"}\n',
    });
  },
});

export const emitMainProcessAssets = (): Plugin => ({
  name: 'emit-main-process-assets',
  generateBundle() {
    for (const asset of fs.readdirSync(assetsDirectory)) {
      const assetPath = path.join(assetsDirectory, asset);

      if (!fs.statSync(assetPath).isFile()) {
        continue;
      }

      this.emitFile({
        type: 'asset',
        fileName: path.posix.join('assets', asset),
        source: fs.readFileSync(assetPath),
      });
    }
  },
});
