const path = require('path');
const fs = require('fs');
const packageJson = require('./package.json');

const { version } = packageJson;
const assets = path.resolve(__dirname, 'src', 'assets');

const config = {
  packagerConfig: {
    name: 'UGRC API Client',
    executableName: 'ugrc-api-client',
    asar: true,
    icon: path.resolve(assets, 'logo.icns'),
    appBundleId: 'com.ugrc.ugrc-api-client',
    appCategoryType: 'public.app-category.developer-tools',
    win32metadata: {
      CompanyName: 'UGRC',
      OriginalFilename: 'UGRC API Client',
    },
    // osxSign: {
    //   identity: `Developer ID Application: State of Utah Department of Technology Services (${process.env.APPLE_ID_PROVIDER})`,
    //   'hardened-runtime': true,
    //   'gatekeeper-assess': false,
    //   entitlements: 'build/entitlements.plist',
    //   'entitlements-inherit': 'build/entitlements.plist',
    //   'signature-flags': 'library',
    // },
    // osxNotarize: {
    //   appBundleId: 'com.ugrc.ugrc-api-client',
    //   appleId: process.env.APPLE_ID_EMAIL,
    //   appleIdPassword: process.env.APPLE_ID_PASSWORD,
    //   ascProvider: process.env.APPLE_ID_PROVIDER,
    // },
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
        contentSecurityPolicy:
          "default-src 'self' *.mapserv.utah.gov; script-src 'self' 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:",
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
