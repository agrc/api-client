import { render } from 'react-dom';
import Routes from './pages/Routes.jsx';
import './styles/tailwind.css';

(async () => {
  render(<Routes />, document.getElementById('root'));
})();
