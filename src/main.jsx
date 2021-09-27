import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Routes from './pages/Routes.jsx';
import './styles/tailwind.css';

(async () => {
  ReactDOM.render(<Routes />, document.getElementById('root'));
})();
