import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Error as ErrorPage } from './pages/Error';
import AppRoutes from './pages/Routes';

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <AppRoutes />
  </ErrorBoundary>,
);
