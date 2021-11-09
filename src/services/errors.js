const { app, ipcMain, shell } = require('electron');
const { openNewGitHubIssue } = require('electron-util');
const osName = require('os-name');

ipcMain.on('relaunchApp', () => {
  app.relaunch();
  app.exit();
});

function getBody(message, stack) {
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
      `mailto:ugrc-developers@utah.gov?subject=API Client - App Crash Report&body=${body.replace(/\n/gm, '%0D%0A')}`
    )
  );
});

ipcMain.on('openIssue', (_, { message, stack }) => {
  openNewGitHubIssue({
    user: 'agrc',
    repo: 'api-client',
    labels: ['bug', 'triage'],
    title: 'App Crash Report',
    body: getBody(message, stack),
  });
});
