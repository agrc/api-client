import { ThumbUpIcon } from '@heroicons/react/outline';
import { Spinner } from './PageElements';
import { useGeocodeContext } from './GeocodeContext.js';

const DropzoneMessaging = ({ isDragActive, file, validation }) => {
  const { geocodeContext } = useGeocodeContext();

  if (isDragActive) {
    return <p className="self-center">Ok, drop it!</p>;
  }

  if (file) {
    return (
      <div className="flex flex-col items-center">
        {validation === 'validating' && (
          <p className="my-0 flex items-center rounded border border-gray-300 bg-gray-200 py-2 px-3 shadow">
            <span className="mr-2">Checking CSV for problems</span>
            <span className="text-indigo-600">
              <Spinner />
            </span>
          </p>
        )}
        <h2 className="my-1 truncate lowercase text-gray-400">
          {file.name}
          {geocodeContext.data.valid && (
            <ThumbUpIcon className="ml-2 inline-flex w-12 align-text-bottom text-indigo-900" />
          )}
        </h2>
      </div>
    );
  }

  return <h2 className="self-center text-center uppercase text-gray-400">Drop the CSV file here</h2>;
};

export default DropzoneMessaging;
