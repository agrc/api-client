import { createContext, useContext } from 'react';
import { useImmerReducer } from 'use-immer';

const GeocodeContext = createContext();

const initialValues = {
  apiKey: '',
  data: {
    street: '',
    zone: '',
    file: null,
    fieldsFromFile: [],
  },
};

const reducer = (draft, action) => {
  switch (action.type) {
    case 'UPDATE_KEY':
      draft.apiKey = action.payload;
      break;
    case 'UPDATE_FILE':
      draft.data.file = action.payload.file;
      draft.data.fieldsFromFile = action.payload.fieldsFromFile;
      draft.data.street = action.payload.street;
      draft.data.zone = action.payload.zone;
      draft.data.sampleData = action.payload.sampleData;
      draft.data.totalRecords = action.payload.totalRecords;
      break;
    case 'UPDATE_FIELDS':
      draft.data[action.meta] = action.payload;
      break;
    case 'RESET':
      draft[action.payload] = initialValues[action.payload];
      break;
    default:
      throw new Error(`Action type: ${action.type} is an unknown reducer type. ${JSON.stringify(action)}`);
  }
};

export default function GeocodeContextProvider({ children }) {
  const [state, dispatch] = useImmerReducer(reducer, initialValues);

  return (
    <GeocodeContext.Provider value={{ geocodeContext: state, geocodeDispatch: dispatch }}>
      {children}
    </GeocodeContext.Provider>
  );
}

export function useGeocodeContext() {
  const context = useContext(GeocodeContext);

  if (!context) {
    throw new Error('useGeocodeContext must be used within a GeocodeContextProvider');
  }

  return context;
}
