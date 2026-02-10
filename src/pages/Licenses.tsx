import { useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router';

export function Licenses() {
  const [licenses, setLicenses] = useState<string>();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    window.ugrc
      .getLicenses()
      .then((data) => setLicenses(data))
      .catch(showBoundary);
  }, [showBoundary]);

  return (
    <article>
      <button type="button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="text-zinc-700">Third Party Licenses</h2>
      <p className="mb-2 text-base">
        This application uses open source software. Below are the licenses for the third-party packages used in this
        project.
      </p>
      <div className="space-y-4">
        <div className="rounded border border-indigo-200 bg-indigo-50 p-4">
          <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-gray-800">{licenses}</pre>
        </div>
      </div>
    </article>
  );
}
