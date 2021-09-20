import React from 'react';

const GeocodeContext = React.createContext();

export default function GeocodeContextProvider({ children }) {
  const [state, setState] = React.useState({
    apiKey: '',
    fields: {
      street: '',
      zone: '',
    },
    file: null,
  });
  const setField = (obj) => {
    setState({
      ...state,
      ...obj,
    });
  };

  return <GeocodeContext.Provider value={[state, setField]}>{children}</GeocodeContext.Provider>;
}

export function useGeocodeContext() {
  const context = React.useContext(GeocodeContext);

  if (!context) {
    throw new Error('useGeocodeContext must be used within a GeocodeContextProvider');
  }

  return context;
}
