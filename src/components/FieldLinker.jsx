import React from 'react';
import { useGeocodeContext } from './GeocodeContext';

const FieldLinker = ({ fieldList }) => {
  const [geocodeContext, setGeocodeContext] = useGeocodeContext();

  return (
    <section>
      <aside className="px-3 py-4 my-4 text-base bg-indigo-100 border rounded shadow">
        <p className="pb-4">
          The UGRC API requires 2 inputs to geocode. The first is a street address in the form of house number, prefix
          direction, street name, street type or suffix direction. e.g. 301 South Main Street or 301 South 100 East
        </p>
        <p className="pb-4">
          The second required input is a zone. A zone can be a zip code or a city name. If your data has both available,
          prefer the zip code.
        </p>
      </aside>
      <aside className="px-3 py-4 my-4 border rounded shadow">
        <p className="pb-4">
          We were able to find these fields in the data provided. If the fields look like the headings in your file
          please map them to the <code>address</code>, <code>city</code>, and or <code>zip</code> field required to
          geocode the data. If the following values do not look like headings, then map the data representing the{' '}
          <code>address</code>, <code>city</code> and or <code>zip</code> field to the fields required for geocoding.
        </p>
        <div className="flex justify-around">
          {fieldList.map((field) => (
            <div key={field}>{field}</div>
          ))}
        </div>
      </aside>
      <h2 className="my-6 text-3xl">Assign Fields</h2>
      <form className="grid gap-4 grid-col-1">
        <label htmlFor="street">Street Field Name</label>
        <select
          name="street"
          onChange={(event) => setGeocodeContext({ fields: { ...geocodeContext.fields, street: event.target.value } })}
          value={geocodeContext.fields.street}
        >
          <option>please select a field</option>
          {fieldList.map((field) => (
            <option key={field}>{field}</option>
          ))}
        </select>
        <label htmlFor="zone">Zone Field Name</label>
        <select
          name="zone"
          onChange={(event) => setGeocodeContext({ fields: { ...geocodeContext.fields, zone: event.target.value } })}
          value={geocodeContext.fields.zone}
        >
          <option>please select a field</option>
          {fieldList.map((field) => (
            <option key={field}>{field}</option>
          ))}
        </select>
      </form>
    </section>
  );
};

export default FieldLinker;
