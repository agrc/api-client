import { render } from 'react-dom';
import Routes from './pages/Routes.jsx';
import './styles/tailwind.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './pages/Error.jsx';

(async () => {
  render(
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <Routes />
    </ErrorBoundary>,
    document.getElementById('root')
  );
})();
