import React from 'react';
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import { App, Data } from './pages/app.jsx';

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/data" component={() => <Data />} />
        <Route path="/" component={() => <App />} />
      </Switch>
    </Router>
  );
}
