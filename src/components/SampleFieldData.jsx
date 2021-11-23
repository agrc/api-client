export default function SampleFieldData({ sample, street, zone }) {
  return (
    <section className="flex flex-col">
      <h3>Sample Geocode Data</h3>
      <section className="flex items-stretch self-center justify-around text-center border divide-x-2 divide-gray-100 rounded-lg shadow-lg w-min">
        <Label label="Street address" value={sample[street]} />
        <Label label="Zone" value={sample[zone]} />
      </section>
    </section>
  );
}

function Label({ label, value }) {
  return (
    <div className="flex-1 p-4">
      <h4 className="max-w-xs my-0 text-indigo-600 truncate whitespace-nowrap">{value ?? '?'}</h4>
      <span className="block text-base text-gray-400 whitespace-nowrap">{label}</span>
    </div>
  );
}
