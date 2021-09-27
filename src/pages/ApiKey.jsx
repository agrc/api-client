import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useGeocodeContext } from '../components/GeocodeContext';

export default function ApiKey() {
  const [geocodeContext, setGeocodeContext] = useGeocodeContext();
  const history = useHistory();

  useEffect(() => {
    window.ugrc.getConfigItem('apiKey').then((key) => {
      setGeocodeContext({ apiKey: key ?? '' });
      if (key) {
        console.log('pushing');
        history.push('/data');
      }
    });
  }, []);

  return (
    <article>
      <h1 className="mb-6 text-5xl">UGRC API Client</h1>
      <p className="mb-10">
        Welcome to the UGRC API Client. This is the official client for geocoding with the UGRC API. To get started you
        will need a complimentary account and an API key.
      </p>
      <ol className="mb-4 ml-10 text-lg list-decimal">
        <li>
          Navigate to the{' '}
          <a href="https://developer.mapserv.utah.gov/AccountAccess" target="_blank" rel="noreferrer">
            Developer Console
          </a>{' '}
          and create an account
        </li>
        <li>
          Create a <a href="https://developer.mapserv.utah.gov/secure/GenerateKey">browser application key</a> with the{' '}
          <code>URL Pattern</code> set to <code>api-client.ugrc.utah.gov</code>
        </li>
        <li>Copy and paste the newly created key into the box below</li>
      </ol>
      <section className="flex flex-col justify-center p-6 mt-10 border rounded shadow bg-gray-50">
        <div className="flex items-center">
          <label className="inline font-semibold" htmlFor="apiKey">
            API Key:
          </label>
          <input
            className="flex-grow max-w-lg ml-4 text-2xl border-0 border-t border-b border-l rounded-none rounded-l"
            type="text"
            id="apiKey"
            value={geocodeContext.apiKey}
            onChange={(e) => setGeocodeContext({ apiKey: e.target.value })}
          />
          <Link
            onClick={() => window.ugrc.saveConfig({ apiKey: geocodeContext.apiKey })}
            to="/data"
            type="button"
            disabled={!geocodeContext.apiKey}
            className="border-0 border-t border-b border-r rounded-none rounded-r"
          >
            Next
          </Link>
        </div>
      </section>
    </article>
  );
}
