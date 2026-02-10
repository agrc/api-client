import { useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router';
import logo from '../assets/logo.svg';

export function Footer() {
  const [version, setVersion] = useState('0.0.0');
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    window.ugrc
      .getAppVersion()
      .then((version) => setVersion(version))
      .catch(showBoundary);
  }, [showBoundary]);

  return (
    <section className="fixed inset-x-0 bottom-0 z-20 mt-10 grid grid-cols-2 items-center bg-indigo-900 px-3 py-2 text-indigo-200">
      <div className="grid auto-cols-max grid-flow-col">
        <img src={logo} alt="logo" className="h-8 w-8" />
        <div className="ml-1 flex flex-col content-center leading-none">
          <div>UGRC API Client</div>
          <Link to="/about" className="text-amber-500 hover:text-amber-300">
            v{version}
          </Link>
        </div>
      </div>
      <div className="text-right">
        <a
          className="text-amber-500 hover:text-amber-300"
          href={`mailto:ugrc-developers@utah.gov?subject=UGRC API Client ${version} Feedback`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Feedback
        </a>
      </div>
    </section>
  );
}
