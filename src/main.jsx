import { render } from 'react-dom';
import Routes from './pages/Routes.jsx';
import './styles/tailwind.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './pages/Error.jsx';

const Sentry = require('@sentry/electron/renderer');

Sentry.init({
  dsn: 'https://02bfd36076c647c9a9a2f66a9c7465c4@o1150892.ingest.sentry.io/6225803',
});

(async () => {
  render(
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <Routes />
    </ErrorBoundary>,
    document.getElementById('root')
  );
})();
