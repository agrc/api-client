import { useGeocodeContext } from './GeocodeContext';

const FieldLinker = () => {
  const { geocodeContext, geocodeDispatch } = useGeocodeContext();

  return (
    <section>
      <p>
        We were able to find the fields below in the file you selected. If the values look like the headings in your
        file please map them to the <code>address</code>, <code>city</code>, and or <code>zip</code> field required to
        geocode the data. If the following values do not look like headings, then map the data representing the{' '}
        <code>address</code>, <code>city</code> and or <code>zip</code> field to the fields required for geocoding.
      </p>
      <div className="my-6 flex flex-wrap justify-around">
        {geocodeContext.data.fieldsFromFile.map((field) => (
          <div
            className="mx-1 my-2 min-w-1/6 rounded border border-indigo-600 bg-indigo-100 px-3 text-center shadow"
            key={field}
          >
            {field}
          </div>
        ))}
      </div>

      <h3>Assign Fields</h3>
      <form className="grid-col-1 mx-auto grid max-w-md gap-3">
        <label htmlFor="street">Street Address Field</label>
        <select
          name="street"
          onChange={(event) => geocodeDispatch({ type: 'UPDATE_FIELDS', payload: event.target.value, meta: 'street' })}
          value={geocodeContext.data.street}
        >
          <option>please select a field</option>
          {geocodeContext.data.fieldsFromFile.map((field) => (
            <option key={field}>{field}</option>
          ))}
        </select>
        <label htmlFor="zone">Zone Field</label>
        <select
          name="zone"
          onChange={(event) => geocodeDispatch({ type: 'UPDATE_FIELDS', payload: event.target.value, meta: 'zone' })}
          value={geocodeContext.data.zone}
        >
          <option>please select a field</option>
          {geocodeContext.data.fieldsFromFile.map((field) => (
            <option key={field}>{field}</option>
          ))}
        </select>
      </form>
    </section>
  );
};

export default FieldLinker;
