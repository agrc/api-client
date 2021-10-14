import { Link } from 'react-router-dom';
import { KeyIcon } from '@heroicons/react/outline';
import { useGeocodeContext } from './GeocodeContext';

export default function QuickApiKey() {
  const { geocodeContext } = useGeocodeContext();

  const sectionClass = window.ugrc.isMacOS() ? 'top-0' : 'bottom-12';
  const divClass = window.ugrc.isMacOS() ? 'rounded-bl-lg' : 'rounded-l-lg border-t';

  return geocodeContext.apiKey ? (
    <section className={`${sectionClass} absolute right-0 h-4`}>
      <div
        className={`${divClass} flex px-3 py-2 text-sm text-indigo-900 bg-pink-200 border-b border-l border-indigo-700 shadow-sm`}
      >
        <KeyIcon className="w-5 h-5" />
        <Link to="/?skip-forward=1" className="mx-2 font-bold">
          {geocodeContext.apiKey}
        </Link>
      </div>
    </section>
  ) : null;
}
