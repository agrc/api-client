import { ThumbsUpIcon } from 'lucide-react';
import { useGeocodeContext } from './GeocodeContext';
import { Spinner } from './PageElements';

interface DropzoneMessagingProps {
  isDragActive: boolean;
  file: File | null;
  validation: 'validating' | 'valid' | 'invalid';
}

export const DropzoneMessaging = ({ isDragActive, file, validation }: DropzoneMessagingProps) => {
  const { geocodeContext } = useGeocodeContext();

  if (isDragActive) {
    return <p className="self-center">Ok, drop it!</p>;
  }

  if (file) {
    return (
      <div className="w-full px-6 text-center">
        {validation === 'validating' && (
          <p className="my-0 flex items-center rounded border border-gray-300 bg-gray-200 px-3 py-2 shadow">
            <span className="mr-2">Checking CSV for problems</span>
            <span className="text-indigo-600">
              <Spinner />
            </span>
          </p>
        )}
        <h2 className="my-1 truncate text-gray-400 lowercase">{file.name}</h2>
        {geocodeContext.data.valid && (
          <ThumbsUpIcon className="mt-2 inline-flex size-12 align-text-bottom text-indigo-900" />
        )}
      </div>
    );
  }

  return <h2 className="self-center text-center text-gray-600 uppercase">Drop the CSV file here</h2>;
};
