import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import logo from '../assets/logo.svg';

export default function Footer() {
  const [version, setVersion] = useState('0.0.0');
  const handleError = useErrorHandler();

  useEffect(() => {
    window.ugrc
      .getAppVersion()
      .then((version) => setVersion(version))
      .catch(handleError);
  }, [handleError]);

  return (
    <section className="fixed inset-x-0 bottom-0 z-20 grid items-center grid-cols-2 px-3 py-2 mt-10 text-indigo-200 bg-indigo-900">
      <div className="grid grid-flow-col auto-cols-max">
        <img src={logo} alt="logo" className="w-8 h-8" />
        <div className="flex flex-col content-center ml-1 leading-none">
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
