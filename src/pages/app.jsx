import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const updateConfig = (newValue) => {
  window.ugrc.saveContent(newValue);
};

export function App() {
  const [key, setKey] = useState('');

  useEffect(() => {
    const getKey = async () => {
      setKey(await window.ugrc.apiKey);
    };

    getKey();
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
          <code>URL Pattern</code> set to <code>https://api-client.ugrc.utah.gov</code>
        </li>
        <li>Copy and paste the newly created key into the box below</li>
      </ol>
      <section className="flex flex-col justify-center p-6 mt-10 border rounded shadow bg-gray-50">
        <div className="flex items-center">
          <label className="inline font-semibold" htmlFor="apiKey">
            API Key:
          </label>
          <input
            className="ml-4 text-2xl border-0 border-t border-b border-l rounded-none rounded-l"
            type="text"
            id="apiKey"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <Link
            onClick={() => updateConfig(key)}
            to="/data"
            type="button"
            className="border-0 border-t border-b border-r rounded-none rounded-r"
          >
            Next
          </Link>
        </div>
      </section>
    </article>
  );
}

export function Data() {
  return (
    <>
      <Link className="px-4 py-1 text-white bg-indigo-400 border border-indigo-600 rounded shadow" to="/">
        &larr; Back
      </Link>
      <h1 className="my-6 text-3xl">Add your data</h1>
      <p className="mb-2 text-base">This data needs to be structured data in a CSV format, ideally with a header row</p>
      <div className="flex items-center justify-center w-full bg-gray-100 border border-indigo-800 rounded shadow h-28">
        <span className="text-gray-400">Drag and drop address data</span>
      </div>
    </>
  );
}
