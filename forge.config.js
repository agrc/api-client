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
      appBundleId: process.env.APPLE_BUNDLE_ID,
      appleId: process.env.APPLE_USER_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
      // ascProvider: process.env.APPLE_TEAM_ID,
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
        certificateFile: process.env['WINDOWS_CODESIGN_FILE'],
        certificatePassword: process.env['WINDOWS_CODESIGN_PASSWORD'],
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'ugrc',
          name: 'api-client',
        },
        draft: true,
        prerelease: false,
      },
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
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
    ],
  ],
};

module.exports = config;
