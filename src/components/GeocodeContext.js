import React, { createContext, useCallback, useContext, useState } from 'react';

const GeocodeContext = createContext();

export default function GeocodeContextProvider({ children }) {
  const [state, setState] = useState({
    version: '1.0.0',
    apiKey: '',
    fields: {
      street: '',
      zone: '',
    },
    file: null,
  });
  const setField = useCallback(
    (obj) => {
      setState({
        ...state,
        ...obj,
      });
    },
    [state]
  );

  return <GeocodeContext.Provider value={[state, setField]}>{children}</GeocodeContext.Provider>;
}

export function useGeocodeContext() {
  const context = useContext(GeocodeContext);

  if (!context) {
    throw new Error('useGeocodeContext must be used within a GeocodeContextProvider');
  }

  return context;
}
