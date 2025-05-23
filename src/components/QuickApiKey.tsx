import { KeySquareIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGeocodeContext } from './GeocodeContext';

export function QuickApiKey() {
  const { geocodeContext } = useGeocodeContext();

  const isMacOS = window.ugrc.isMacOS();
  const sectionClass = isMacOS ? 'top-0' : 'bottom-12';
  const divClass = isMacOS ? 'rounded-bl-lg' : 'rounded-l-lg border-t';

  return geocodeContext.apiKey ? (
    <section className={`${sectionClass} absolute right-0 h-4`}>
      <div
        className={`${divClass} flex border-b border-l border-indigo-700 bg-pink-200 px-3 py-2 text-sm text-indigo-900 shadow-sm`}
      >
        <KeySquareIcon className="size-5" />
        <Link to="/?skip-forward=1" className="mx-2 font-bold">
          {geocodeContext.apiKey}
        </Link>
      </div>
    </section>
  ) : null;
}
