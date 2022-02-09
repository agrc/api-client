import humanizeDuration from 'humanize-duration';
import { Link, useHistory } from 'react-router-dom';
import { useGeocodeContext } from '../components/GeocodeContext';

const numberFormat = new Intl.NumberFormat('en-US');

export default function Plan() {
  const { geocodeContext } = useGeocodeContext();
  const history = useHistory();
  const duration = (geocodeContext.data.totalRecords / 3) * 1000;

  const start = () => {
    history.push('/geocode');
  };

  return (
    <article>
      <Link type="back-button" to="/wkid">
        &larr; Back
      </Link>
      <h2>The plan</h2>
      <section className="mb-10 flex w-full items-stretch justify-around divide-x-2 divide-gray-100 rounded-lg border text-center shadow-lg">
        <div className="flex-1 p-6">
          <h2 className="my-0 text-indigo-600">{numberFormat.format(geocodeContext.data.totalRecords)}</h2>
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
