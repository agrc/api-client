export default function SampleFieldData({ sample, street, zone }) {
  return (
    <section className="flex flex-col">
      <h3>Sample Geocode Data</h3>
      <section className="flex w-min items-stretch justify-around divide-x-2 divide-gray-100 self-center rounded-lg border text-center shadow-lg">
        <Label label="Street address" value={sample[street]} />
        <Label label="Zone" value={sample[zone]} />
      </section>
    </section>
  );
}

function Label({ label, value }) {
  return (
    <div className="flex-1 p-4">
      <h4 className="my-0 max-w-xs truncate whitespace-nowrap text-indigo-600">{value ?? '?'}</h4>
      <span className="block whitespace-nowrap text-base text-gray-400">{label}</span>
    </div>
  );
}
