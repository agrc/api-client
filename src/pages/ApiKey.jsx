import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ThumbUpIcon, ThumbDownIcon } from '@heroicons/react/outline';
import { useErrorHandler } from 'react-error-boundary';
import { useGeocodeContext } from '../components/GeocodeContext';
import { Spinner } from '../components/PageElements';

export default function ApiKey() {
  const { geocodeContext, geocodeDispatch } = useGeocodeContext();
  const history = useHistory();
  const [keyStatus, setKeyStatus] = useState('unknown');
  const [inputValue, setInputValue] = useState('');
  const handleError = useErrorHandler();

  useEffect(() => {
    window.ugrc
      .getConfigItem('apiKey')
      .then((key) => {
        geocodeDispatch({ type: 'UPDATE_KEY', payload: key ?? '' });

        if (key && history.location.search !== '?skip-forward=1') {
          history.push('/data');
        } else {
          if (key) {
            checkApiKey(key).then((isValid) => {
              setKeyStatus(isValid ? 'valid' : 'invalid');
              geocodeDispatch({ type: 'UPDATE_KEY', payload: isValid ? key : '' });
            });
          }

          setInputValue(key ?? '');
        }
      })
      .catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, handleError]);

  const onApiKeyChange = async (event) => {
    const apiKey = event.target.value;
    setInputValue(apiKey);

    const isValid = await checkApiKey(apiKey);

    setKeyStatus(isValid ? 'valid' : 'invalid');
    geocodeDispatch({ type: 'UPDATE_KEY', payload: isValid ? apiKey : '' });
  };

  const checkApiKey = (apiKey) => {
    setKeyStatus('validating');
    if (apiKey.length > 19 || apiKey.length < 19) {
      setKeyStatus('invalid');

      return false;
    }

    return window.ugrc.checkApiKey(apiKey).catch(handleError);
  };

  return (
    <article>
      <p>
        Welcome to the UGRC API Client. This is the official client for geocoding with the UGRC API. To get started you
        will need a complimentary account and an API key.
      </p>
      <h2 className="-rotate-3 text-center">
        <span className="block">Ready?</span>
        <span className="block text-indigo-600">Let&apos;s go!</span>
      </h2>
      <ol className="mb-4 ml-10 list-decimal text-lg">
        <li>
          Navigate to the{' '}
          <a href="https://developer.mapserv.utah.gov/AccountAccess" target="_blank" rel="noreferrer">
            Developer Console
          </a>{' '}
          and create an account
        </li>
        <li>Confirm your email address with the UGRC API</li>
        <li>
          Create a{' '}
          <a href="https://developer.mapserv.utah.gov/secure/GenerateKey" target="_blank" rel="noreferrer">
            browser application key
          </a>{' '}
          with the <code>URL Pattern</code> set to <code>api-client.ugrc.utah.gov</code>
        </li>
        <li>Copy and paste the newly created key into the box below</li>
      </ol>
      <section className="mt-10 flex flex-col justify-center rounded border bg-gray-50 p-6 pb-2 shadow">
        <div className="flex items-center">
          <label className="inline" htmlFor="apiKey">
            API Key
          </label>
          <input
            className="ml-4 h-12 max-w-lg flex-grow rounded-none rounded-l border-0 border-t border-b border-l text-2xl focus:ring-0"
            type="text"
            id="apiKey"
            maxLength="19"
            value={inputValue}
            onChange={onApiKeyChange}
          />
          <button
            onClick={() => {
              window.ugrc
                .saveConfig({ apiKey: geocodeContext.apiKey })
                .then(() => history.push('/data'))
                .catch(handleError);
            }}
            type="button"
            disabled={keyStatus === 'invalid'}
            className="h-12 w-24 rounded-none rounded-r border-0 border-t border-b border-r"
          >
            {keyStatus === 'validating' ? <Spinner /> : <>Next</>}
          </button>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="font-bold tracking-tight text-gray-600">Is my key ok?</div>
          {keyStatus === 'valid' ? (
            <ThumbUpIcon className="w-16 text-indigo-900" />
          ) : (
            <ThumbDownIcon className="w-16 text-amber-500" />
          )}
        </div>
      </section>
    </article>
  );
}
