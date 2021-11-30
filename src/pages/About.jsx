import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import logo from '../assets/logo.svg';

export default function About() {
  const [info, setInfo] = useState({
    applicationName: 'UGRC API Client',
    version: '0.0.0',
    electronVersion: '0.0.0',
    website: 'https://api.mapserv.utah.gov',
    repo: 'https://github.com/agrc/api-client',
  });
  const history = useHistory();
  const handleError = useErrorHandler();

  useEffect(() => {
    window.ugrc.getAppInfo().then(setInfo).catch(handleError);
  }, [handleError]);

  return (
    <article>
      <button type="back-button" onClick={() => history.goBack()}>
        &larr; Back
      </button>
      <section className="relative z-10 grid items-stretch justify-around w-full grid-cols-2 mt-4 text-center border rounded-lg shadow-lg bg-white/95">
        <div className="flex-1 p-6">
          <h2 className="my-0 text-indigo-600">
            <a href={`${info.repo}/releases`} target="_blank" rel="noopener noreferrer">
              {info.applicationVersion}
            </a>
          </h2>
          <span className="block text-base text-gray-400">app version</span>
        </div>
        <div className="flex-1 p-6">
          <h2 className="my-0 text-indigo-600">{info.version}</h2>
          <span className="block text-base text-gray-400">electron version</span>
        </div>
        <h2 className="col-span-2 my-4 text-center text-indigo-900">{info.applicationName}</h2>
        <div className="flex-1 p-6">
          <h2 className="my-0 text-indigo-600">
            <a href={info.repo} target="_blank" rel="noopener noreferrer">
              github
            </a>
          </h2>
          <span className="block text-base text-gray-400">repository</span>
        </div>
        <div className="flex-1 p-6">
          <h2 className="my-0 text-indigo-600">
            <a href={info.website} target="_blank" rel="noopener noreferrer">
              api explorer
            </a>
          </h2>
          <span className="block text-base text-gray-400">website</span>
        </div>
      </section>
      <div
        className="absolute inset-0 z-0 bg-fixed bg-center bg-no-repeat bg-contain bg-origin-content"
        style={{ backgroundImage: `url(${logo})` }}
      ></div>
    </article>
  );
}
