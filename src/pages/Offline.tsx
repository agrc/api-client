import { Chrome } from '../components/PageElements';

export function Offline() {
  return (
    <article>
      <Chrome>
        <h2 className="text-indigo-600">Your internet is missing!?</h2>
        <p>
          This app requires an internet connection to function properly. Please check your network connection, modem,
          router, and power supply. You can also try{' '}
          <button className="font-bold text-amber-500 hover:text-amber-300" onClick={window.ugrc.relaunchApp}>
            restarting the application
          </button>{' '}
          to see if that helps.
        </p>
      </Chrome>
    </article>
  );
}
