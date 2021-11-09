import { useEffect } from 'react';
import { Link, withRouter, MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import GeocodeContextProvider from '../components/GeocodeContext.js';
import ApiKey from './ApiKey.jsx';
import Data from './Data.jsx';
import Plan from './Plan.jsx';
import About from './About.jsx';
import Geocoding from './Geocoding.jsx';
import Wkid from './Wkid.jsx';
import { Chrome, Header, Footer } from '../components/PageElements';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './Error.jsx';

const RouterErrorPage = ({ error }) => {
  return (
    <ErrorPage error={error}>
      <p>
        You may now{' '}
        <Link className="font-bold text-yellow-500 hover:text-yellow-300" to="/?skip-forward=1" replace={true}>
          go back
        </Link>{' '}
        to the previous page to check your settings to try again or{' '}
        <button className="font-bold text-yellow-500 hover:text-yellow-300" onClick={window.ugrc.relaunchApp}>
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
  return (
    <GeocodeContextProvider>
      <Router
        defaultRoute
        getUserConfirmation={(message, callback) => window.ugrc.getUserConfirmation(message).then(callback)}
      >
        <Header />
        <Chrome>
          <ScrollToTop />
          <ErrorBoundary FallbackComponent={RouterErrorPage}>
            <Switch>
              {pages.map(({ path, Component }) => (
                <Route
                  key={path}
                  path={`/${path}`}
                  component={() => (
                    <ErrorBoundary FallbackComponent={RouterErrorPage}>
                      <Component />
                    </ErrorBoundary>
                  )}
                />
              ))}
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
  }, []);

  return null;
};

export const ScrollToTop = withRouter(Scrolling);
