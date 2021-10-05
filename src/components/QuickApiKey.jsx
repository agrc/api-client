import React from 'react';
import { Link } from 'react-router-dom';
import { KeyIcon } from '@heroicons/react/outline';
import { useGeocodeContext } from './GeocodeContext';

export default function QuickApiKey() {
  const geocodeContext = useGeocodeContext()[0];

  return geocodeContext.apiKey ? (
    <section className="absolute top-0 right-0 h-4">
      <div className="flex px-3 py-2 text-sm text-indigo-900 bg-pink-200 border-b border-l border-indigo-700 rounded-bl-lg shadow-sm">
        <KeyIcon className="w-5 h-5" />
        <Link to="/?skip-forward=1" className="mx-2 font-bold">
          {geocodeContext.apiKey}
        </Link>
      </div>
    </section>
  ) : null;
}
