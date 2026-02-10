import type { FallbackProps } from 'react-error-boundary';
import { Chrome } from '../components/PageElements';

export function Error({ error }: FallbackProps) {
  window.ugrc.trackEvent({ category: 'error', label: 'unhandled error' });

  const errorObj = error as Error;

  return (
    <article>
      <Chrome>
        <h2 className="text-indigo-600">This is a little embarrassing...</h2>
        <p>
          We are really sorry. There was an error in the application that caused it to crash. The best way to make this
          not happen again for you or anyone else is to report the issue to us. It should only take a few moments. But
          first check our{' '}
          <a
            className="text-amber-500 hover:text-amber-300"
            href="https://agrc-status.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            status page
          </a>{' '}
          to see if it is already being worked on.
        </p>

        {window.ugrc && (
          <>
            <h2 className="mb-8 text-center">Report by</h2>
            <section className="mb-8 grid grid-cols-2 gap-4 text-center">
              <div className="flex flex-col items-center rounded border border-gray-200 px-3 py-2">
                <h3 className="mt-0">GitHub account</h3>
                <button
                  type="button"
                  onClick={() => window.ugrc.openIssue({ message: errorObj.message, stack: errorObj.stack })}
                >
                  Let&apos;s go
                </button>
              </div>
              <div className="flex flex-col items-center rounded border border-gray-200 px-3 py-2">
                <h3 className="mt-0">Email</h3>
                <button
                  type="button"
                  onClick={() => window.ugrc.openEmail({ message: errorObj.message, stack: errorObj.stack })}
                >
                  Compose
                </button>
              </div>
            </section>
            <h2 className="mb-8 text-center text-indigo-600">Thank you so much!</h2>
            <p>
              You may now{' '}
              <button className="font-bold text-amber-500 hover:text-amber-300" onClick={window.ugrc.relaunchApp}>
                restart the application
              </button>{' '}
              and try geocoding again.
            </p>
          </>
        )}
        <details className="mt-6">
          <summary>
            <span role="img" aria-label="nerd emoji">
              🤓
            </span>{' '}
            Technical Details
          </summary>
          {errorObj && errorObj.message ? (
            <>
              <label htmlFor="message">Error message:</label>
              <pre id="message" className="overflow-auto text-base text-gray-600">{`${errorObj.message}`}</pre>
            </>
          ) : null}
          {errorObj && errorObj.stack ? (
            <>
              <label htmlFor="stack">Stack trace:</label>
              <pre id="stack" className="overflow-auto text-base text-gray-600">{`${errorObj.stack}`}</pre>
            </>
          ) : null}
          {errorObj && !errorObj.message && !errorObj.stack ? (
            <pre className="overflow-auto text-base text-gray-600">{String(errorObj)}</pre>
          ) : null}
        </details>
      </Chrome>
    </article>
  );
}
