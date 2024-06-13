import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { Spinner } from './PageElements/index.js';
import { useGeocodeContext } from './GeocodeContext.jsx';

const DropzoneMessaging = ({ isDragActive, file, validation }) => {
  const { geocodeContext } = useGeocodeContext();

  if (isDragActive) {
    return <p className="self-center">Ok, drop it!</p>;
  }

  if (file) {
    return (
      <div className="w-full px-6 text-center">
        {validation === 'validating' && (
          <p className="my-0 flex items-center rounded border border-gray-300 bg-gray-200 py-2 px-3 shadow">
            <span className="mr-2">Checking CSV for problems</span>
            <span className="text-indigo-600">
              <Spinner />
            </span>
          </p>
        )}
        <h2 className="my-1 truncate lowercase text-gray-400">{file.name}</h2>
        {geocodeContext.data.valid && (
          <HandThumbUpIcon className="mt-2 inline-flex w-12 align-text-bottom text-indigo-900" />
        )}
      </div>
    );
  }

  return <h2 className="self-center text-center uppercase text-gray-400">Drop the CSV file here</h2>;
};

export default DropzoneMessaging;
