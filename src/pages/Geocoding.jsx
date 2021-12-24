import { useState, useEffect, useRef } from 'react';
import { Link, Prompt } from 'react-router-dom';
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
    lastRequest: null,
  });
  const startTime = useRef(new Date());
  const { geocodeContext } = useGeocodeContext();
  const draggable = useRef(null);

  const onDragStart = (event) => {
    event.preventDefault();
    window.ugrc.startDrag('ugrc_geocode_results.csv');
  };

  const cancel = (reason) => {
    window.ugrc.cancelGeocode(reason);
  };

  useEffect(() => {
    window.ugrc.subscribeToGeocodingUpdates((_, data) => {
      setStats(data);
    });

    window.ugrc.getConfigItem('wkid').then((wkid) => {
      window.ugrc.geocode({
        filePath: geocodeContext.data.file.path,
        fields: { street: geocodeContext.data.street, zone: geocodeContext.data.zone },
        apiKey: geocodeContext.apiKey,
        wkid,
        sampleData: geocodeContext.data.sampleData,
      });
    });

    return () => {
      cancel('back');
      window.ugrc.unsubscribeFromGeocodingUpdates();
    };
  }, [geocodeContext]);

  const progress = stats.rowsProcessed / stats.totalRows || 0;
  const elapsedTime = new Date().getTime() - startTime.current.getTime();
  const timePerRow = elapsedTime / stats.rowsProcessed;
  const estimatedTimeRemaining = timePerRow * (stats.totalRows - stats.rowsProcessed);

  const formatError = (statusCode, body) => {
    if (statusCode >= 500) {
      return body;
    }

    try {
      const response = JSON.parse(body);

      return response.message;
    } catch {
      return body;
    }
  };

  const getElementsByStatus = (status) => {
    switch (status) {
      case 'running': {
        return (
          <>
            <button
              type="button"
              onClick={() => cancel('early-cancellation')}
              disabled={stats.rowsProcessed > 0 && stats.totalRows === stats.rowsProcessed}
            >
              Cancel
            </button>
            <Prompt
              message={JSON.stringify({
                detail: 'Navigating to a different page will cancel the current geocoding process.',
                message: 'Are you sure you would like to navigate?',
              })}
            />
          </>
        );
      }
      case 'complete': {
        return (
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
        );
      }
      case 'cancelled': {
        return (
          <section className="px-3 bg-red-100 border border-red-200 rounded shadow">
            <h3 className="text-center text-red-800 ">This job was cancelled</h3>
            <p>
              <Link to="/plan">Go back to the plan page</Link> to restart the process.
            </p>
          </section>
        );
      }
      case 'fail-fast': {
        return (
          <section className="px-3 bg-red-100 border border-red-200 rounded shadow">
            <h3 className="text-center text-red-800">This job has fast failed</h3>
            <p>
              A fast failure occurs when the <span className="font-bold">first {stats.failures} records</span> do not
              succeed to geocode. You might need to remove or reorder the first {stats.failures} rows of your data to
              avoid fast failing.
            </p>
            <ol className="ml-8 list-decimal">
              <li>
                <strong>The fields could be mapped incorrectly.</strong>{' '}
                <Link to="/data">Go back to the data page</Link> and make sure the sample data looks correct.
              </li>
              <li>
                <strong>Your API key could be invalid.</strong> <Link to="/?skip-forward=1">Check that your key</Link>{' '}
                has a thumbs up on the API page and create a new key if this is incorrect.
              </li>
              <li>
                <strong>The Web API is having trouble.</strong>{' '}
                <a href="https://agrc-status.netlify.app" target="_blank" rel="noopener noreferrer">
                  Check our status page
                </a>{' '}
                for any reported outages.
              </li>
            </ol>
            <p>
              This is the Web API response for the last request (street: {stats.lastRequest?.request.street}, zone:{' '}
              {stats.lastRequest?.request.zone}) to help debug the issue
            </p>
            <pre className="px-3 py-2 mx-6 text-white whitespace-normal bg-red-400 border-red-800 rounded shadow">
              <div className="mb-2">{stats.lastRequest.request.url}</div>
              <div>
                {stats.lastRequest?.response.status} -{' '}
                {formatError(stats.lastRequest?.response.status, stats.lastRequest?.response.body)}
              </div>
            </pre>
            <p>
              <Link to="/plan">Go back to the plan page</Link> to restart the process.
            </p>
          </section>
        );
      }
      default:
        return null;
    }
  };

  return (
    <article>
      <Link type="back-button" to="/plan">
        &larr; Back
      </Link>
      <h2>Geocoding progress</h2>
      <progress className="w-full h-16" value={progress}>
        {progress}%
      </progress>
      <section>
        <dl>
          <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Total Rows</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{stats.totalRows}</dd>
          </div>
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Rows processed</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{stats.rowsProcessed}</dd>
          </div>
          <div className="px-4 py-5 bg-gray-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Active match rate</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">
              {percentFormatter.format(stats.activeMatchRate)}
            </dd>
          </div>
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Average match score</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{stats.averageScore || ''}</dd>
          </div>
          <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Failures</dt>
            <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">{stats.failures}</dd>
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
        {getElementsByStatus(stats.status)}
      </section>
    </article>
  );
}
