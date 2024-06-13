import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, Prompt } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useErrorBoundary } from 'react-error-boundary';
import { useGeocodeContext } from '../components/GeocodeContext.jsx';

const numberFormat = new Intl.NumberFormat('en-US');
const percentFormatter = new Intl.NumberFormat('en-US', { style: 'percent' });

export default function Geocoding() {
  const { geocodeContext } = useGeocodeContext();
  const startTime = useRef(new Date());
  const draggable = useRef(null);
  const [stats, setStats] = useState({
    rowsProcessed: 0,
    totalRows: geocodeContext.data.totalRecords,
    activeMatchRate: 0,
    averageScore: 0,
    status: 'idle',
    lastRequest: null,
    failures: 0,
  });
  const handleError = useErrorBoundary();

  const onDragStart = (event) => {
    event.preventDefault();
    window.ugrc.startDrag('ugrc_geocode_results.csv').catch(handleError);
  };

  const cancel = useCallback(
    (reason) => {
      window.ugrc.cancelGeocode(reason).catch(handleError);
    },
    [handleError],
  );

  useEffect(() => {
    window.ugrc.subscribeToGeocodingUpdates((_, data) => {
      setStats(data);
    });

    window.ugrc
      .getConfigItem('wkid')
      .then((wkid) => {
        window.ugrc
          .geocode({
            filePath: geocodeContext.data.file.path,
            fields: { street: geocodeContext.data.street, zone: geocodeContext.data.zone },
            apiKey: geocodeContext.apiKey,
            wkid,
            sampleData: geocodeContext.data.sampleData,
            totalRows: geocodeContext.data.totalRecords,
          })
          .catch(handleError);
      })
      .catch(handleError);

    return () => {
      cancel('back');
      window.ugrc.unsubscribeFromGeocodingUpdates();
    };
  }, [geocodeContext, handleError, cancel]);

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
            className="mx-auto cursor-grab rounded-lg border bg-gray-100 p-12 text-center shadow"
            ref={draggable}
            draggable={true}
            onDragStart={onDragStart}
          >
            <p>Drag and drop this file to save the results.</p>
            <DocumentTextIcon className="mx-auto w-32" />
            <span className="mx-auto font-mono text-sm">ugrc_geocode_results.csv</span>
          </div>
        );
      }
      case 'cancelled': {
        return (
          <section className="rounded border border-red-200 bg-red-100 px-3 shadow">
            <h3 className="text-center text-red-800 ">This job was cancelled</h3>
            <p>
              <Link to="/plan">Go back to the plan page</Link> to restart the process.
            </p>
          </section>
        );
      }
      case 'fail-fast': {
        return (
          <section className="rounded border border-red-200 bg-red-100 px-3 shadow">
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
                <strong>The API is having trouble.</strong>{' '}
                <a href="https://agrc-status.netlify.app" target="_blank" rel="noopener noreferrer">
                  Check our status page
                </a>{' '}
                for any reported outages.
              </li>
            </ol>
            <div>
              <p>This was the API response for the last request to help debug the issue</p>
              <div className="text-base">
                <span className="font-semibold">street: </span>
                {stats.lastRequest?.request.street}
              </div>
              <div className="text-base">
                <span className="font-semibold">zone:</span> {stats.lastRequest?.request.zone}
              </div>
            </div>
            <pre className="mt-6 whitespace-normal break-all rounded border-red-800 bg-red-400 px-3 py-2 text-white shadow">
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
      <div className="pb-6">{getElementsByStatus(stats.status)}</div>
      <progress className="h-16 w-full" value={progress}>
        {progress}%
      </progress>
      <section>
        <dl>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Total Rows</dt>
            <dd className="mt-1 text-gray-900 sm:col-span-2 sm:mt-0">{numberFormat.format(stats.totalRows)}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Rows processed</dt>
            <dd className="mt-1 text-gray-900 sm:col-span-2 sm:mt-0">{numberFormat.format(stats.rowsProcessed)}</dd>
          </div>
          <div className="bg-gray-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Active match rate</dt>
            <dd className="mt-1 text-gray-900 sm:col-span-2 sm:mt-0">
              {percentFormatter.format(stats.activeMatchRate)}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Average match score</dt>
            <dd className="mt-1 text-gray-900 sm:col-span-2 sm:mt-0">{stats.averageScore || ''}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Failures</dt>
            <dd className="mt-1 text-gray-900 sm:col-span-2 sm:mt-0">{numberFormat.format(stats.failures)}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Time elapsed</dt>
            <dd className="mt-1 text-gray-900 sm:col-span-2 sm:mt-0">
              {humanizeDuration(elapsedTime, { round: true })}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="font-medium text-gray-500">Estimated time remaining</dt>
            <dd className="mt-1 text-gray-900 sm:col-span-2 sm:mt-0">
              {humanizeDuration(estimatedTimeRemaining, { round: true })}
            </dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
