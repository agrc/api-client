import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Error as ErrorPage } from './pages/Error';
import AppRoutes from './pages/Routes';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <AppRoutes />
  </ErrorBoundary>,
);
