import { app, ipcMain, shell } from 'electron';
// import unhandled from 'electron-unhandled';
// eslint-disable-next-line import/no-unresolved
// import { openNewGitHubIssue } from 'electron-util';
import osName from 'os-name';

// Module format "cjs" does not support top-level await. Use the "es" or "system" output formats rather.
// unhandled({
//   reportButton: (error) => {
//     console.log(error);
//     // openIssue(error.message, error.stack);
//   },
//   logger: (error) => {
//     console.error(error, true);
//   },
// });

ipcMain.on('relaunchApp', () => {
  app.relaunch();
  app.exit();
});

function getBody(message: string, stack: string) {
  return `### What happened?



### Steps To Reproduce



### App Version

${app.getVersion()}

### Electron Version

${process.versions.electron}

### Operating System

${osName()}

### Relevant log output

#### Error message

\`${message}\`

#### Stack trace

\`\`\`st
${stack}
\`\`\`
`;
}

ipcMain.on('openEmail', (_, { message, stack }) => {
  const body = getBody(message, stack);

  setImmediate(() =>
    shell.openExternal(
      `mailto:ugrc-developers@utah.gov?subject=API Client - App Crash Report&body=${body.replace(/\n/gm, '%0D%0A')}`,
    ),
  );
});

// ipcMain.on('openIssue', (_, { message, stack }) => {
//   openIssue(message, stack);
// });

// const openIssue = (message: string, stack: string) => {
//   openNewGitHubIssue({
//     user: 'agrc',
//     repo: 'api-client',
//     labels: ['bug', 'triage'],
//     title: 'App Crash Report',
//     body: getBody(message, stack),
//   });
// };
