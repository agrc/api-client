import { useGeocodeContext } from './GeocodeContext';

const FieldLinker = () => {
  const { geocodeContext, geocodeDispatch } = useGeocodeContext();

  return (
    <section className="mt-6">
      <p>The UGRC API requires 2 inputs to geocode. The first is a street address in the form of</p>
      <section className="flex items-stretch justify-around w-full mb-10 text-center border divide-x-2 divide-gray-100 rounded-lg shadow-lg">
        <div className="flex-1 p-4">
          <h2 className="mb-0 text-indigo-600">301</h2>
          <span className="block text-base text-gray-400">house number</span>
        </div>
        <div className="flex-1 p-4">
          <h2 className="mb-0 text-indigo-600">South</h2>
          <span className="block text-base text-gray-400">prefix direction</span>
        </div>
        <div className="flex-1 p-4">
          <h2 className="mb-0 text-indigo-600">Main</h2>
          <span className="block text-base text-gray-400">street name</span>
        </div>
        <div className="flex-1 p-4">
          <h2 className="mb-0 text-indigo-600">Street</h2>
          <span className="block text-base text-gray-400">street type or suffix direction</span>
        </div>
      </section>
      <p>
        The second required input is a zone. A zone can be a zip code or a city name. If your data has both available,
        prefer the zip code.
      </p>
      <p>
        We were able to find the fields below in the file you selected. If the values look like the headings in your
        file please map them to the <code>address</code>, <code>city</code>, and or <code>zip</code> field required to
        geocode the data. If the following values do not look like headings, then map the data representing the{' '}
        <code>address</code>, <code>city</code> and or <code>zip</code> field to the fields required for geocoding.
      </p>
      <div className="flex justify-around my-6">
        {geocodeContext.data.fieldsFromFile.map((field) => (
          <div className="w-1/6 text-center bg-indigo-100 border border-indigo-600 rounded shadow" key={field}>
            {field}
          </div>
        ))}
      </div>

      <h3>Assign Fields</h3>
      <form className="grid max-w-md gap-3 mx-auto grid-col-1">
        <label htmlFor="street">Street Field Name</label>
        <select
          name="street"
          onChange={(event) =>
            geocodeDispatch({ type: 'UPDATE_FIELDS', payload: event.target.value, meta: 'street' })
          }
          value={geocodeContext.data.street}
        >
          <option>please select a field</option>
          {geocodeContext.data.fieldsFromFile.map((field) => (
            <option key={field}>{field}</option>
          ))}
        </select>
        <label htmlFor="zone">Zone Field Name</label>
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
