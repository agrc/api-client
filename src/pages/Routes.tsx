import { JSX, useEffect } from 'react';
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';
import { useNavigatorStatus } from 'react-navigator-status';
import { createMemoryRouter, Link, Outlet, RouterProvider, useLocation } from 'react-router';
import { About, ApiKey, Data, Error as ErrorPage, Geocoding, Licenses, Offline, Plan, Wkid } from '.';
import GeocodeContextProvider from '../components/GeocodeContext';
import { Chrome, Footer, Header } from '../components/PageElements';

const RouterErrorPage = ({ error }: { error: Error }) => {
  return (
    <ErrorPage error={error}>
      <p>
        You may now{' '}
        <Link className="font-bold text-amber-500 hover:text-amber-300" to="/?skip-forward=1" replace={true}>
          go back
        </Link>{' '}
        to the previous page to check your settings to try again or{' '}
        <button className="font-bold text-amber-500 hover:text-amber-300" onClick={window.ugrc.relaunchApp}>
          restart the application
        </button>{' '}
        to see if that helps.
      </p>
    </ErrorPage>
  );
};

function ScrollToTop(): JSX.Element | null {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

// Layout component that wraps all routes
function Layout() {
  const online = useNavigatorStatus();
  const handleError = useErrorBoundary();

  useEffect(() => {
    window.addEventListener('keyup', (event) => {
      if (event.ctrlKey && event.key === '/') {
        handleError.showBoundary(new Error('Test error'));
      }
    });
  }, [handleError]);

  return (
    <>
      <Header />
      <Chrome>
        <ScrollToTop />
        <ErrorBoundary FallbackComponent={RouterErrorPage}>{online ? <Outlet /> : <Offline />}</ErrorBoundary>
      </Chrome>
      <Footer />
    </>
  );
}

const pages = [
  { path: 'about', Component: About },
  { path: 'licenses', Component: Licenses },
  { path: 'geocode', Component: Geocoding },
  { path: 'plan', Component: Plan },
  { path: 'wkid', Component: Wkid },
  { path: 'data', Component: Data },
  { path: '', Component: ApiKey },
];

// Create the router configuration
const router = createMemoryRouter([
  {
    path: '/',
    element: <Layout />,
    children: pages.map(({ path, Component }) => ({
      path: path === '' ? '' : `/${path}`,
      element: (
        <ErrorBoundary FallbackComponent={RouterErrorPage}>
          <Component />
        </ErrorBoundary>
      ),
    })),
  },
]);

export default function AppRoutes() {
  return (
    <GeocodeContextProvider>
      <RouterProvider router={router} />
    </GeocodeContextProvider>
  );
}
