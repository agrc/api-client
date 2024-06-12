import { useEffect } from 'react';
import { Link, withRouter, MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import { useNavigatorStatus } from 'react-navigator-status';
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';
import GeocodeContextProvider from '../components/GeocodeContext.jsx';
import { ApiKey, Data, Plan, About, Geocoding, Wkid, Offline, ErrorPage } from '.';
import { Chrome, Header, Footer } from '../components/PageElements';

const RouterErrorPage = ({ error }) => {
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

const pages = [
  { path: 'about', Component: About },
  { path: 'geocode', Component: Geocoding },
  { path: 'plan', Component: Plan },
  { path: 'wkid', Component: Wkid },
  { path: 'data', Component: Data },
  { path: '', Component: ApiKey },
];

export default function Routes() {
  const online = useNavigatorStatus();
  const handleError = useErrorBoundary();

  useEffect(() => {
    window.addEventListener('keyup', (event) => {
      if (event.ctrlKey && event.key === '/') {
        handleError(new Error('Test error'));
      }
    });
  }, [handleError]);

  return (
    <GeocodeContextProvider>
      <Router
        defaultRoute
        getUserConfirmation={(message, callback) =>
          window.ugrc.getUserConfirmation(message).then(callback).catch(handleError)
        }
      >
        <Header />
        <Chrome>
          <ScrollToTop />
          <ErrorBoundary FallbackComponent={RouterErrorPage}>
            <Switch>
              {online ? (
                pages.map(({ path, Component }) => (
                  <Route
                    key={path}
                    path={`/${path}`}
                    component={() => (
                      <ErrorBoundary FallbackComponent={RouterErrorPage}>
                        <Component />
                      </ErrorBoundary>
                    )}
                  />
                ))
              ) : (
                <Route path="/" component={Offline} />
              )}
            </Switch>
          </ErrorBoundary>
        </Chrome>
        <Footer />
      </Router>
    </GeocodeContextProvider>
  );
}

const Scrolling = ({ history }) => {
  useEffect(() => {
    const remove = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      remove();
    };
  }, [history]);

  return null;
};

export const ScrollToTop = withRouter(Scrolling);
