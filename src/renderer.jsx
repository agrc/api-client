import { createRoot } from 'react-dom/client';
import Routes from './pages/Routes.jsx';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './pages/Error.jsx';
import * as Sentry from '@sentry/electron/renderer';
import { init as reactInit } from '@sentry/react';

import './styles/tailwind.css';

Sentry.init(
  {
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.25,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  },
  reactInit,
);

createRoot(document.getElementById('root')).render(
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <Routes />
  </ErrorBoundary>,
);
