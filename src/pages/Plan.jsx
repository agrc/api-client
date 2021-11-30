import { useEffect, useState } from 'react';
import humanizeDuration from 'humanize-duration';
import { Link, useHistory } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import { useGeocodeContext } from '../components/GeocodeContext';

export default function Plan() {
  const { geocodeContext } = useGeocodeContext();
  const [rows, setRows] = useState(0);
  const history = useHistory();
  const duration = (rows / 3) * 1000;
  const handleError = useErrorHandler();

  useEffect(() => {
    window.ugrc.getRecordCount(geocodeContext.data.file.path).then(setRows).catch(handleError);
  }, [geocodeContext.data.file.path, handleError]);

  const start = () => {
    history.push('/geocode');
  };

  return (
    <article>
      <Link type="back-button" to="/wkid">
        &larr; Back
      </Link>
      <h2>The plan</h2>
      <section className="flex items-stretch justify-around w-full mb-10 text-center border divide-x-2 divide-gray-100 rounded-lg shadow-lg">
        <div className="flex-1 p-6">
          <h2 className="my-0 text-indigo-600">{rows}</h2>
          <span className="block text-base text-gray-400">addresses</span>
        </div>
        <div className="flex-1 p-6">
          <h2 className="my-0 text-indigo-600">{humanizeDuration(duration, { round: true })}</h2>
          <span className="block text-base text-gray-400">to complete</span>
        </div>
      </section>
      <h3 className="text-center">{geocodeContext.data.file.name}</h3>
      <button onClick={start} type="button">
        Start
      </button>
    </article>
  );
}
