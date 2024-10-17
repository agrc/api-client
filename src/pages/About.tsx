import { useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useHistory } from 'react-router-dom';
import logo from '../assets/logo.svg';

export function About() {
  const [info, setInfo] = useState({
    applicationName: 'UGRC API Client',
    version: '0.0.0',
    electronVersion: '0.0.0',
    website: 'https://api.mapserv.utah.gov',
    repo: 'https://github.com/agrc/api-client',
  });
  const history = useHistory();
  const handleError = useErrorBoundary();

  useEffect(() => {
    window.ugrc.getAppInfo().then(setInfo).catch(handleError);
  }, [handleError]);

  return (
    <article>
      <button type="back-button" onClick={() => history.goBack()}>
        &larr; Back
      </button>
      <section className="relative z-10 mt-4 grid w-full grid-cols-2 items-stretch justify-around rounded-lg border bg-white/95 text-center shadow-lg">
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
        <h2 className="col-span-2 my-4 text-center text-indigo-900">
          <a href="https://gis.utah.gov/products/sgid/address/api-client/" target="_blank" rel="noopener noreferrer">
            {info.applicationName}
          </a>
          <span className="block text-base font-normal text-gray-400">product page</span>
        </h2>
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
          <span className="block text-base text-gray-400">documentation</span>
        </div>
        <h2 className="col-span-2 my-4 text-center text-indigo-900">
          <a href="https://developer.mapserv.utah.gov/" target="_blank" rel="noopener noreferrer">
            self service
          </a>
          <span className="block text-base font-normal text-gray-400">key management</span>
        </h2>
      </section>
      <div
        className="absolute inset-0 z-0 bg-contain bg-fixed bg-center bg-no-repeat bg-origin-content"
        style={{ backgroundImage: `url(${logo})` }}
      ></div>
    </article>
  );
}
