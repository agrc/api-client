import React from 'react';
import { useGeocodeContext } from '../components/GeocodeContext';

export default function ApiKey() {
  const geocodeContext = useGeocodeContext()[0];

  return (
    <section className="absolute top-0 right-0 h-4">
      <div className="flex px-3 py-2 text-sm text-indigo-900 bg-gray-100 border-b border-l rounded-bl-lg">
        <h3>ApiKey:</h3>
        <span className="font-bold">{geocodeContext.apiKey}</span>
      </div>
    </section>
  );
}
