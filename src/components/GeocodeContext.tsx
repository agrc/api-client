import { createContext, useContext } from 'react';
import { useImmerReducer } from 'use-immer';

const initialValues = {
  apiKey: '',
  data: {
    street: '',
    zone: '',
    file: null as File | null,
    fieldsFromFile: [] as string[],
    sampleData: {},
    totalRecords: 0,
    valid: null as boolean | null,
  },
};

const GeocodeContext = createContext<
  { geocodeContext: typeof initialValues; geocodeDispatch: React.Dispatch<unknown> } | undefined
>(undefined);

const reducer = (draft, action) => {
  switch (action.type) {
    case 'UPDATE_KEY':
      draft.apiKey = action.payload;
      break;
    case 'UPDATE_FILE':
      draft.data = { ...draft.data, ...action.payload };
      break;
    case 'UPDATE_FIELDS':
      draft.data[action.meta] = action.payload;
      break;
    case 'RESET':
      draft.data = initialValues.data;
      break;
    default:
      throw new Error(`Action type: ${action.type} is an unknown reducer type. ${JSON.stringify(action)}`);
  }
};

export default function GeocodeContextProvider({ children }: { children: React.ReactNode }) {
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
