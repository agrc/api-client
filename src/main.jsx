import { createRoot } from 'react-dom/client';
import Routes from './pages/Routes.jsx';
import './styles/tailwind.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './pages/Error.jsx';
require('./services/sentry');

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <Routes />
  </ErrorBoundary>
);
