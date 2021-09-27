import React, { useEffect, useState } from 'react';
import humanizeDuration from 'humanize-duration';
import { Link, useHistory } from 'react-router-dom';
import { useGeocodeContext } from '../components/GeocodeContext';
import ApiKey from '../components/ApiKey.jsx';

export default function Plan() {
  const geocodingContext = useGeocodeContext()[0];
  const [rows, setRows] = useState(0);
  const history = useHistory();
  const duration = (rows / 3) * 1000;

  useEffect(() => {
    window.ugrc.getRecordCount(geocodingContext.file.path).then(setRows);
  }, [geocodingContext.file.path]);

  const start = () => {
    history.push('/geocode');
  };

  return (
    <>
      <ApiKey />
      <Link className="px-4 py-1 text-white bg-indigo-400 border border-indigo-600 rounded shadow" to="/data">
        &larr; Back
      </Link>
      <h1 className="my-6 text-3xl">Geocoding Plan</h1>
      <div>
        <dl>
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">File</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{geocodingContext.file.name}</dd>
          </div>
          <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Number of records</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{rows}</dd>
          </div>
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Estimated time</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{humanizeDuration(duration, { round: true })}</dd>
          </div>
        </dl>
      </div>

      <button onClick={start} type="button">
        Start
      </button>
    </>
  );
}
