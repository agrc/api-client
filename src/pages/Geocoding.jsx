import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import { DocumentTextIcon } from '@heroicons/react/outline';
import { useGeocodeContext } from '../components/GeocodeContext.js';

const percentFormatter = new Intl.NumberFormat('en-US', { style: 'percent' });

export default function Geocoding() {
  const [stats, setStats] = useState({
    rowsProcessed: 0,
    totalRows: 0,
    activeMatchRate: 0,
    averageScore: 0,
    status: 'idle',
  });
  const startTime = useRef(new Date());
  const abortController = useRef(new AbortController());
  const geocodeContext = useGeocodeContext()[0];
  const draggable = useRef(null);

  const onDragStart = (event) => {
    event.preventDefault();
    window.ugrc.startDrag('ugrc_geocode_results.csv');
  };

  useEffect(() => {
    window.ugrc.onGeocodingUpdate((_, data) => {
      setStats(data);
    });

    window.ugrc.getConfigItem('wkid').then((wkid) => {
      window.ugrc.geocode({
        filePath: geocodeContext.file.path,
        fields: geocodeContext.fields,
        apiKey: geocodeContext.apiKey,
        wkid,
        abortSignal: abortController.current.signal,
      });
    });
  }, [geocodeContext]);

  const progress = stats.rowsProcessed / stats.totalRows || 0;
  const elapsedTime = new Date().getTime() - startTime.current.getTime();
  const timePerRow = elapsedTime / stats.rowsProcessed;
  const estimatedTimeRemaining = timePerRow * (stats.totalRows - stats.rowsProcessed);

  const cancel = () => {
    window.ugrc.cancelGeocode();
  };

  return (
    <article>
      <Link type="back-button" to="/plan">
        &larr; Back
      </Link>
      <h2>Geocoding progress</h2>
      <progress className="w-full h-16 " value={progress}>
        {progress}%
      </progress>
      <section>
        <dl>
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Rows processed</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{stats.rowsProcessed}</dd>
          </div>
          <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Total Rows</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{stats.totalRows}</dd>
          </div>
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Active match rate</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">
              {percentFormatter.format(stats.activeMatchRate)}
            </dd>
          </div>
          <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Average match score</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{stats.averageScore}</dd>
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
        {stats.status === 'complete' && (
          <div
            className="p-12 mx-auto text-center bg-gray-100 border rounded-lg shadow cursor-grab"
            ref={draggable}
            draggable={true}
            onDragStart={onDragStart}
          >
            <p>Drag and drop this file to save the results.</p>
            <DocumentTextIcon className="w-32 mx-auto" />
            <span className="mx-auto font-mono text-sm">ugrc_geocode_results.csv</span>
          </div>
        )}
      </section>
      {stats.status === 'running' ? (
        <button
          type="button"
          onClick={cancel}
          disabled={stats.rowsProcessed > 0 && stats.totalRows === stats.rowsProcessed}
        >
          Cancel
        </button>
      ) : null}
    </article>
  );
}
