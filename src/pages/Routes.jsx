import React from 'react';
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import GeocodeContextProvider from '../components/GeocodeContext.js';
import ApiKey from './ApiKey.jsx';
import Data from './Data.jsx';
import Plan from './Plan.jsx';

export default function Routes() {
  return (
    <GeocodeContextProvider>
      <Router defaultRoute>
        <Switch>
          <Route path="/plan" component={() => <Plan />} />
          <Route path="/data" component={() => <Data />} />
          <Route path="/" component={() => <ApiKey />} />
        </Switch>
      </Router>
    </GeocodeContextProvider>
  );
}
