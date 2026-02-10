import { useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router';
import logo from '../assets/logo.svg';

export function About() {
  const [info, setInfo] = useState<AppInfo>({
    applicationName: 'UGRC API Client',
    applicationVersion: '0.0.0',
    version: '0.0.0',
    website: 'https://api.mapserv.utah.gov',
    repo: 'https://github.com/agrc/api-client',
  });
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    window.ugrc.getAppInfo().then(setInfo).catch(showBoundary);
  }, [showBoundary]);

  return (
    <article className="bg-center bg-no-repeat bg-origin-content" style={{ backgroundImage: `url(${logo})` }}>
      <button type="button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <section className="relative z-10 mt-4 grid w-full grid-cols-2 items-stretch justify-around rounded-lg border border-gray-200 bg-white/95 text-center shadow-lg">
        <div className="flex-1 p-6">
          <h2 className="my-0 text-indigo-600">
            <a href={`${info.repo}/releases`} target="_blank" rel="noopener noreferrer">
              {info.applicationVersion}
            </a>
          </h2>
          <span className="block text-base text-gray-600">app version</span>
        </div>
        <div className="flex-1 p-6">
          <h2 className="my-0 text-indigo-600">{info.version}</h2>
          <span className="block text-base text-gray-600">electron version</span>
        </div>
        <h2 className="col-span-2 my-4 text-center text-indigo-900">
          <a href="https://gis.utah.gov/products/sgid/address/api-client/" target="_blank" rel="noopener noreferrer">
            {info.applicationName}
          </a>
          <span className="block text-base font-normal text-gray-600">product page</span>
        </h2>
        <div className="flex-1 p-6">
          <h2 className="my-0 text-indigo-600">
            <a href={info.repo} target="_blank" rel="noopener noreferrer">
              github
            </a>
          </h2>
          <span className="block text-base text-gray-600">repository</span>
        </div>
        <div className="flex-1 p-6">
          <h2 className="my-0 text-indigo-600">
            <a href={info.website} target="_blank" rel="noopener noreferrer">
              api explorer
            </a>
          </h2>
          <span className="block text-base text-gray-600">documentation</span>
        </div>
        <h2 className="col-span-2 my-4 text-center text-indigo-900">
          <a href="https://developer.mapserv.utah.gov/" target="_blank" rel="noopener noreferrer">
            self service
          </a>
          <span className="block text-base font-normal text-gray-600">key management</span>
        </h2>
      </section>
      <section className="relative z-10 mt-4 text-center">
        <button type="button" onClick={() => navigate('/licenses')} className="text-base">
          View Third Party Licenses
        </button>
      </section>
    </article>
  );
}
