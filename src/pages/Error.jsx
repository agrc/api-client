export default function Error({ error }) {
  return (
    <article className="">
      <div className="p-10">
        <h2 className="my-0 text-indigo-600">This is a little embarrassing...</h2>
        <p className="mt-10">
          There was an error in the application that caused it to crash. Here are some technical details.{' '}
          <span role="img" aria-label="nerd emoji">
            🤓
          </span>
        </p>
        {error && error.message ? (
          <>
            <label htmlFor="message">Error message:</label>
            <pre id="message" className="overflow-auto text-base text-gray-400">{`${error.message}`}</pre>
          </>
        ) : null}
        {error && error.stack ? (
          <>
            <label htmlFor="stack">Stack trace:</label>
            <pre id="stack" className="overflow-auto text-base text-gray-400">{`${error.stack}`}</pre>
          </>
        ) : null}
        {error && !error.message && !error.stack ? (
          <pre className="overflow-auto text-base text-gray-400">{error.toString()}</pre>
        ) : null}
        <div className="flex justify-between">
          {window.ugrc ? (
            <>
              <button type="button" onClick={window.ugrc.relaunchApp}>
                Restart application
              </button>
              <button
                type="button"
                onClick={() => window.ugrc.openIssue({ message: error.message, stack: error.stack })}
              >
                Report this issue
              </button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
