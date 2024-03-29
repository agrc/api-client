const path = require('path');
const packageJson = require('./package.json');
require('dotenv').config();

const { version } = packageJson;
const assets = path.resolve(__dirname, 'src', 'assets');

const config = {
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
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
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
    },
    {
      name: '@electron-forge/maker-dmg',
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
      name: '@electron-forge/plugin-webpack',
      config: {
        devContentSecurityPolicy:
          "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; connect-src 'self' 'unsafe-inline' *.ingest.sentry.io data:;",
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
            },
          ],
        },
      },
    },
  ],
  buildIdentifier: 'prod',
};

module.exports = config;
