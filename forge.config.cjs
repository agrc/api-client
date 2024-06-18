const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const packageJson = require('./package.json');
const path = require('node:path');
require('dotenv').config();

const { version } = packageJson;

const assets = path.resolve(__dirname, 'src', 'assets');

module.exports = {
  packagerConfig: {
    name: 'UGRC API Client',
    executableName: 'ugrc-api-client',
    asar: true,
    icon: path.resolve(assets, 'logo.icns'),
    appBundleId: process.env.APPLE_BUNDLE_ID,
    appCategoryType: 'public.app-category.developer-tools',
    win32metadata: {
      CompanyName: 'UGRC',
      OriginalFilename: 'UGRC API Client',
    },
    osxSign: {
      identity: process.env.APPLE_IDENTITY,
      hardenedRuntime: true,
      'gatekeeper-assess': false,
      entitlements: 'build/entitlements.plist',
      'entitlements-inherit': 'build/entitlements.plist',
    },
    osxNotarize: {
      tool: 'notarytool',
      appBundleId: process.env.APPLE_BUNDLE_ID,
      appleId: process.env.APPLE_USER_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      arch: 'arm64',
      config: {
        name: 'ugrc-api-client',
        authors: 'UGRC Developers',
        exe: 'ugrc-api-client.exe',
        iconUrl:
          'https://raw.githubusercontent.com/agrc/api-client/dac3554721f3ef6341910e5eee5c5395820ec8f1/src/assets/logo.ico',
        loadingGif: './src/assets/loading.gif',
        noMsi: true,
        setupExe: `ugrc-api-client-${version}-win32-setup.exe`,
        setupIcon: path.resolve(assets, 'logo.ico'),
        certificateFile: './build/cert/windows.p12',
        certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD,
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      arch: 'arm64',
    },
    {
      name: '@electron-forge/maker-dmg',
      arch: 'arm64',
      config: {
        title: '${productName} ${version}',
        window: {
          size: {
            width: 400,
            height: 274,
          },
        },
        background: './src/assets/dmg-background.png',
        icon: './src/assets/logo.icns',
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
      },
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'agrc',
          name: 'api-client',
        },
        draft: true,
        prerelease: false,
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        devContentSecurityPolicy:
          "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; connect-src 'self' 'unsafe-inline' *.ingest.sentry.io data:;",
        // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
        // If you are familiar with Vite configuration, it will look really familiar.
        build: [
          {
            // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
            entry: 'src/main.js',
            config: 'vite.main.config.js',
          },
          {
            entry: 'src/preload.js',
            config: 'vite.preload.config.js',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.js',
          },
        ],
      },
    },
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
