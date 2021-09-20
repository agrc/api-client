import React, { useEffect, useState } from 'react';
import { useGeocodeContext } from '../components/GeocodeContext';
import humanizeDuration from 'humanize-duration';

export default function Info() {
  const geocodingContext = useGeocodeContext()[0];
  const [rows, setRows] = useState(0);
  const duration = (rows / 3) * 1000;

  useEffect(() => {
    window.ugrc.getRecordCount(geocodingContext.file.path).then(setRows);
  }, [geocodingContext.file.path]);

  return (
    <div>
      <p>
        You have selected {geocodingContext.file.name} with {rows} records.
      </p>
      <p>We estimate this will take approximately {humanizeDuration(duration, { round: true })}.</p>
      <button>Start</button>
    </div>
  );
}
