const { app, ipcMain } = require('electron');
const { openNewGitHubIssue } = require('electron-util');
const osName = require('os-name');

ipcMain.on('relaunchApp', () => {
  app.relaunch();
  app.exit();
});

ipcMain.on('openIssue', (_, { message, stack }) => {
  openNewGitHubIssue({
    user: 'agrc',
    repo: 'api-client',
    labels: ['bug', 'triage'],
    title: 'App Crash Report',
    // indents in the string template cause issues with GitHub markdown
    body: `
### Code of Conduct

- [ ] I agree to follow this project's Code of Conduct

### Is there an existing issue for this?

- [ ] I have searched the existing issues

### App Version

${app.getVersion()}

### Electron Version

${process.versions.electron}

### Operating System

${osName()}

### What happened?



### Steps To Reproduce



### Relevant log output

#### Error message

\`${message}\`

#### Stack trace

\`\`\`
${stack}
\`\`\`
`,
  });
});
