import React, { useEffect } from 'react';
import { withRouter, MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import GeocodeContextProvider from '../components/GeocodeContext.js';
import ApiKey from './ApiKey.jsx';
import Data from './Data.jsx';
import Plan from './Plan.jsx';
import Geocoding from './Geocoding.jsx';
import { Chrome, Header, Footer } from '../components/PageElements';

export default function Routes() {
  return (
    <GeocodeContextProvider>
      <Router defaultRoute>
        <Header />
        <Chrome>
          <ScrollToTop />
          <Switch>
            <Route path="/geocode" component={() => <Geocoding />} />
            <Route path="/plan" component={() => <Plan />} />
            <Route path="/data" component={() => <Data />} />
            <Route path="/" component={() => <ApiKey />} />
          </Switch>
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
