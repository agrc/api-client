import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import ApiKey from '../components/ApiKey.jsx';
import { useGeocodeContext } from '../components/GeocodeContext.js';

const percentFormatter = new Intl.NumberFormat('en-US', { style: 'percent' });

export default function Geocoding() {
  const [status, setStatus] = useState({
    rowsProcessed: 0,
    totalRows: 0,
    activeMatchRate: 0,
    averageScore: 0,
  });
  const startTime = useRef(new Date());
  const abortController = useRef(new AbortController());
  const geocodeContext = useGeocodeContext()[0];

  useEffect(() => {
    window.ugrc.onGeocodingUpdate((_, data) => {
      setStatus(data);
    });

    window.ugrc.geocode({
      filePath: geocodeContext.file.path,
      fields: geocodeContext.fields,
      apiKey: geocodeContext.apiKey,
      abortSignal: abortController.current.signal,
    });
  }, [geocodeContext]);

  const progress = status.rowsProcessed / status.totalRows || 0;
  const elapsedTime = new Date().getTime() - startTime.current.getTime();
  const timePerRow = elapsedTime / status.rowsProcessed;
  const estimatedTimeRemaining = timePerRow * (status.totalRows - status.rowsProcessed);

  const cancel = () => {
    abortController.current.abort();
  };

  return (
    <>
      <ApiKey />
      <Link className="px-4 py-1 text-white bg-indigo-400 border border-indigo-600 rounded shadow" to="/plan">
        &larr; Back
      </Link>
      <h1 className="my-6 text-3xl">Geocoding Status</h1>
      <progress className="w-full h-16 rounded" value={progress}>
        {progress}%
      </progress>
      <div>
        <dl>
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Rows processed</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{status.rowsProcessed}</dd>
          </div>
          <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Total Rows</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{status.totalRows}</dd>
          </div>
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Active match rate</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">
              {percentFormatter.format(status.activeMatchRate)}
            </dd>
          </div>
          <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Average match score</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{status.averageScore}</dd>
          </div>
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Time elapsed</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">
              {humanizeDuration(elapsedTime, { round: true })}
            </dd>
          </div>
          <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Estimated time remaining</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">
              {humanizeDuration(estimatedTimeRemaining, { round: true })}
            </dd>
          </div>
        </dl>
      </div>
      <button type="button" onClick={cancel}>
        Cancel
      </button>
    </>
  );
}
