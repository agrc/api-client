import QuickApiKey from './QuickApiKey.jsx';
import logo from '../assets/logo.svg';

const gradient =
  import.meta.env.VITE_IS_BETA === 'true' ? 'from-amber-900 via-amber-400' : 'from-indigo-900 via-indigo-400';
export default function Header() {
  return (
    <section
      id="drag"
      className={
        'fixed inset-x-0 top-0 z-20 mb-24 grid h-24 auto-cols-max grid-flow-col items-center border-b border-indigo-700 bg-gradient-to-r px-3 py-4 shadow-xl to-pink-400 ' +
        gradient
      }
    >
      <img src={logo} alt="logo" className="h-16 w-16" />
      <h1 className="ml-2 self-end text-indigo-100 drop-shadow-lg">API Client</h1>
      <QuickApiKey />
    </section>
  );
}
