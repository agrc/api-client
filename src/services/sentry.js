let Sentry;
if (global.process) {
  Sentry = require('@sentry/electron/main');
} else {
  Sentry = require('@sentry/electron/renderer');
}

Sentry.init({
  dsn: 'https://02bfd36076c647c9a9a2f66a9c7465c4@o1150892.ingest.sentry.io/6225803',
});
