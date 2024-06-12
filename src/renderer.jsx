import { createRoot } from 'react-dom/client';
import Routes from './pages/Routes.jsx';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './pages/Error.jsx';

import './styles/tailwind.css';

createRoot(document.getElementById('root')).render(
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <Routes />
  </ErrorBoundary>,
);
