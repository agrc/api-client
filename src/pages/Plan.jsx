import React, { useEffect, useState } from 'react';
import humanizeDuration from 'humanize-duration';
import { Link } from 'react-router-dom';
import { useGeocodeContext } from '../components/GeocodeContext';
import ApiKey from '../components/ApiKey.jsx';

export default function Plan() {
  const geocodingContext = useGeocodeContext()[0];
  const [rows, setRows] = useState(0);
  const duration = (rows / 3) * 1000;

  useEffect(() => {
    window.ugrc.getRecordCount(geocodingContext.file.path).then(setRows);
  }, [geocodingContext.file.path]);

  const start = () => {};

  return (
    <>
      <ApiKey />
      <Link className="px-4 py-1 text-white bg-indigo-400 border border-indigo-600 rounded shadow" to="/data">
        &larr; Back
      </Link>
      <p>
        You have selected {geocodingContext.file.name} with {rows} records.
      </p>
      <p>We estimate this will take approximately {humanizeDuration(duration, { round: true })}.</p>
      <button onClick={start} type="button">
        Start
      </button>
    </>
  );
}
