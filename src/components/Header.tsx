import logo from '../assets/logo.svg';
import { QuickApiKey } from './QuickApiKey';

const gradient =
  import.meta.env.VITE_IS_BETA === 'true' ? 'from-amber-900 via-amber-400' : 'from-indigo-900 via-indigo-400';
export function Header() {
  return (
    <section
      id="drag"
      className={
        'fixed inset-x-0 top-0 z-20 mb-24 grid h-24 auto-cols-max grid-flow-col items-center border-b border-indigo-700 bg-linear-to-r to-pink-400 px-3 py-4 shadow-xl ' +
        gradient
      }
    >
      <img src={logo} alt="logo" className="h-16 w-16" />
      <h1 className="ml-2 self-end text-indigo-100 drop-shadow-lg">API Client</h1>
      <QuickApiKey />
    </section>
  );
}
