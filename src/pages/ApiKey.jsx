import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useGeocodeContext } from '../components/GeocodeContext';

export default function ApiKey() {
  const [geocodeContext, setGeocodeContext] = useGeocodeContext();
  const history = useHistory();
  const [isValid, setIsValid] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    window.ugrc.getConfigItem('apiKey').then((key) => {
      setGeocodeContext({ apiKey: key ?? '' });
      if (key && history.location.search !== '?skip-forward=1') {
        history.push('/data');
      } else {
        setInputValue(key ?? '');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const onApiKeyChange = async (event) => {
    const apiKey = event.target.value;
    setInputValue(apiKey);

    if (apiKey.length > 19 || apiKey.length < 19) {
      setIsValid(false);
      setGeocodeContext({ apiKey: '' });

      return;
    }

    const checkResult = await window.ugrc.checkApiKey(apiKey);
    setIsValid(checkResult);

    if (checkResult) {
      setGeocodeContext({ apiKey });
    } else {
      setGeocodeContext({ apiKey: '' });
    }
  };

  return (
    <article>
      <p>
        Welcome to the UGRC API Client. This is the official client for geocoding with the UGRC API. To get started you
        will need a complimentary account and an API key.
      </p>
      <h2 className="text-center -rotate-3">
        <span className="block">Ready?</span>
        <span className="block text-indigo-600">Let&apos;s go!</span>
      </h2>
      <ol className="mb-4 ml-10 text-lg list-decimal">
        <li>
          Navigate to the{' '}
          <a href="https://developer.mapserv.utah.gov/AccountAccess" target="_blank" rel="noreferrer">
            Developer Console
          </a>{' '}
          and create an account
        </li>
        <li>
          Create a{' '}
          <a href="https://developer.mapserv.utah.gov/secure/GenerateKey" target="_blank" rel="noreferrer">
            browser application key
          </a>{' '}
          with the <code>URL Pattern</code> set to <code>api-client.ugrc.utah.gov</code>
        </li>
        <li>Copy and paste the newly created key into the box below</li>
      </ol>
      <section className="flex flex-col justify-center p-6 mt-10 border rounded shadow bg-gray-50">
        <div className="flex items-center">
          <label className="inline" htmlFor="apiKey">
            API Key
          </label>
          <input
            className="flex-grow max-w-lg ml-4 text-2xl border-0 border-t border-b border-l rounded-none rounded-l"
            type="text"
            id="apiKey"
            value={inputValue}
            onChange={onApiKeyChange}
          />
          <button
            onClick={() => {
              window.ugrc.saveConfig({ apiKey: geocodeContext.apiKey });
              history.push('/data');
            }}
            type="button"
            disabled={!isValid}
            className="border-0 border-t border-b border-r rounded-none rounded-r"
          >
            Next
          </button>
        </div>
      </section>
    </article>
  );
}
