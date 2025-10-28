import { utils } from '@electron-forge/core';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { PublisherGithub } from '@electron-forge/publisher-github';
import type { ForgeConfig } from '@electron-forge/shared-types';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import dotenv from 'dotenv';
import path from 'path';
import packageJson from './package.json';

if (process.env.NODE_ENV !== 'production') {
  // skip loading any local env files in production
  dotenv.config();
}

const fromBuildIdentifier = utils.fromBuildIdentifier;

const { version } = packageJson;
const assets = path.resolve(__dirname, 'src', 'assets');
const kmsKeyPath = (() => {
  const raw = process.env.GCP_KEY_PATH || '';
  if (!raw) return '';
  if (raw.startsWith('gkms://')) return raw;
  return `gkms://${raw.replace(/^\/+/, '')}`;
})();

const useKsp = (process.env.WINDOWS_SIGN_USE_KSP || '').toLowerCase() === 'true';
const providerSwitch = useKsp ? '/ksp' : '/csp';
const windowsSign = {
  // Ensure the library uses SHA256 and RFC3161 timestamp server (avoids default /t and sha1)
  certificateSha1: process.env.CERTIFICATE_SHA1,
  digestAlgorithm: 'sha256',
  rfcTimestampServer: 'http://timestamp.sectigo.com',
  // Append KMS-specific args; also add verbosity and explicit store
  additionalSignToolArgs: [
    '/td',
    'SHA256',
    '/s',
    'my',
    providerSwitch,
    'Google Cloud KMS Provider',
    '/kc',
    kmsKeyPath,
    '/v',
    '/debug',
  ],
};

const config: ForgeConfig = {
  buildIdentifier: process.env.VITE_IS_BETA === 'true' ? 'beta' : 'prod',
  packagerConfig: {
    // @ts-expect-error expect string
    name: fromBuildIdentifier({
      beta: 'UGRC API Client Beta',
      prod: 'UGRC API Client',
    }),
    executableName: 'ugrc-api-client',
    asar: true,
    icon: path.resolve(assets, 'logo.icns'),
    // @ts-expect-error expect string
    appBundleId: fromBuildIdentifier({
      beta: 'com.beta.electron.ugrc-api-client',
      prod: 'com.electron.ugrc-api-client',
    }),
    appCategoryType: 'public.app-category.developer-tools',
    win32metadata: {
      CompanyName: 'UGRC',
      OriginalFilename: 'UGRC API Client',
    },
    // Enable Windows signing only in production; cast to avoid dependency version typing drift
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    windowsSign: process.env.NODE_ENV !== 'production' ? undefined : (windowsSign as any),
    osxSign:
      process.env.NODE_ENV !== 'production'
        ? {}
        : {
            identity: process.env.APPLE_IDENTITY,
            // hardenedRuntime: true,
            // 'gatekeeper-assess': false,

            // entitlements: 'build/entitlements.plist',
            // 'entitlements-inherit': 'build/entitlements.plist',
          },
    osxNotarize: {
      appleId: process.env.APPLE_USER_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    },
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
      noMsi: true,
      setupExe: `ugrc-api-client-${version}-win32-setup.exe`,
      setupIcon: path.resolve(assets, 'logo.ico'),
    }),
    new MakerZIP({}, ['darwin']),
    new MakerDMG({
      title: '${productName} ${version}',
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
  publishers: [
    new PublisherGithub({
      repository: {
        owner: 'agrc',
        name: 'api-client',
      },
      draft: true,
      prerelease: !!fromBuildIdentifier({
        beta: true,
        prod: false,
      }),
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
  ],
};

export default config;
