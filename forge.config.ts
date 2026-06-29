import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerWix } from '@electron-forge/maker-wix';
import { MakerZIP } from '@electron-forge/maker-zip';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { VitePlugin } from '@electron-forge/plugin-vite';
import type { ForgeConfig } from '@electron-forge/shared-types';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import type { SignToolOptions } from '@electron/windows-sign';
import dotenv from 'dotenv';
import path from 'path';
import packageJson from './package.json';

if (process.env.NODE_ENV !== 'production') {
  // skip loading any local env files in production
  dotenv.config();
}

const { version } = packageJson;
const assets = path.resolve(__dirname, 'src', 'assets');
const kmsKeyPath = (() => {
  if (process.env.NODE_ENV !== 'production') {
    return '';
  }

  const ring = (process.env.GCP_KEYRING_PATH || '').trim();
  const keyName = (process.env.GCP_KEY_NAME || '').trim();

  if (!ring) {
    throw new Error('GCP_KEYRING_PATH environment variable is not set');
  }

  return `${ring}/cryptoKeys/${keyName}/cryptoKeyVersions/1`;
})();

// Resolve the certificate path (use the actual folder `build/cert/windows.cer` in repo)
const certPath = path.resolve(__dirname, 'build', 'cert', 'windows.cer');
const appleId = process.env.APPLE_USER_ID;
const appleIdPassword = process.env.APPLE_PASSWORD;
const appleTeamId = process.env.APPLE_TEAM_ID;

const windowsSign: SignToolOptions = {
  hashes: ['sha256' as NonNullable<SignToolOptions['hashes']>[number]],
  certificateFile: certPath,
  timestampServer: 'http://timestamp.sectigo.com',
  description: 'UGRC API Client',
  website: 'https://gis.utah.gov/products/sgid/address/api-client/',
  signWithParams: ['/v', '/csp', 'Google Cloud KMS Provider', '/kc', kmsKeyPath],
};
const squirrelWindowsSign: SignToolOptions = {
  ...windowsSign,
  hookModulePath: path.resolve(__dirname, 'scripts', 'windows-sign-serial-hook.cjs'),
};
const windowsSignParams = Array.isArray(windowsSign.signWithParams)
  ? windowsSign.signWithParams.join(' ')
  : windowsSign.signWithParams;
const isBeta = process.env.VITE_IS_BETA === 'true';
const productName = isBeta ? 'UGRC API Client Beta' : 'UGRC API Client';
const isUniversalArch = process.argv.includes('--arch=universal') || process.env.npm_config_arch === 'universal';
const shouldSkipFusesForUniversal =
  process.platform === 'darwin' && isUniversalArch && process.env.NODE_ENV !== 'production';

const config: ForgeConfig = {
  buildIdentifier: isBeta ? 'beta' : 'prod',
  packagerConfig: {
    name: productName,
    executableName: 'ugrc-api-client',
    asar: true,
    icon: path.resolve(assets, 'logo.icns'),
    appBundleId: isBeta ? 'com.beta.electron.ugrc-api-client' : 'com.electron.ugrc-api-client',
    appCategoryType: 'public.app-category.developer-tools',
    win32metadata: {
      CompanyName: 'UGRC',
      OriginalFilename: productName,
    },
    osxSign:
      process.env.NODE_ENV !== 'production'
        ? undefined
        : {
            identity: process.env.APPLE_IDENTITY,
            // hardenedRuntime: true,
            // 'gatekeeper-assess': false,

            // entitlements: 'build/entitlements.plist',
            // 'entitlements-inherit': 'build/entitlements.plist',
          },
    osxNotarize:
      appleId && appleIdPassword && appleTeamId
        ? {
            appleId,
            appleIdPassword,
            teamId: appleTeamId,
          }
        : undefined,
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: 'ugrc-api-client',
      authors: 'UGRC Developers',
      exe: 'ugrc-api-client.exe',
      iconUrl:
        'https://raw.githubusercontent.com/agrc/api-client/dac3554721f3ef6341910e5eee5c5395820ec8f1/src/assets/logo.ico',
      loadingGif: './src/assets/loading.gif',
      // Keep Squirrel focused on the setup.exe + update artifacts.
      // We keep MakerWix below because it produces the traditional enterprise-style MSI we want to ship.
      noMsi: true,
      setupExe: `ugrc-api-client-${version}-win32-setup.exe`,
      setupIcon: path.resolve(assets, 'logo.ico'),
      windowsSign: squirrelWindowsSign,
    }),
    new MakerWix({
      certificateFile: certPath,
      description: 'The official UGRC API client',
      icon: path.resolve(assets, 'logo.ico'),
      language: 1033,
      manufacturer: 'UGRC',
      name: productName,
      signWithParams: windowsSignParams,
      version,
      windowsSign,
    }),
    new MakerZIP({}, ['darwin']),
    new MakerDMG({
      title: productName,
      additionalDMGOptions: {
        window: {
          size: {
            width: 400,
            height: 274,
          },
        },
      },
      background: './src/assets/dmg-background.png',
      icon: './src/assets/logo.icns',
      // appPath: '',
      contents: (options) => {
        return [
          {
            x: 75,
            y: 140,
            type: 'file',
            path: options.appPath,
          },
          {
            x: 300,
            y: 140,
            type: 'link',
            path: '/Applications',
          },
        ];
      },
    }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    ...(shouldSkipFusesForUniversal
      ? []
      : [
          // Fuses are used to enable/disable various Electron functionality
          // at package time, before code signing the application
          new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
          }),
        ]),
  ],
};

export default config;
