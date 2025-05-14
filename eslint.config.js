import { browser, server } from '@ugrc/eslint-config';

export default [
  ...server,
  ...browser,
  {
    ignores: [
      '**/.vite/**/*',
      '**/vendor/**/*',
      '**/__mocks__',
      '**/__snapshots__',
      '**/node_modules',
      '**/dist',
      '**/package-lock.json',
      '**/.vscode',
    ],
  },
];
