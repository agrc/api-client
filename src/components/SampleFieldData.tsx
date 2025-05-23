export function SampleFieldData({
  sample,
  street,
  zone,
}: {
  sample: Record<string, string>;
  street: string;
  zone: string;
}) {
  return (
    <section className="flex flex-col">
      <h3 className="text-zinc-700">Sample Geocode Data</h3>
      <section className="flex w-min items-stretch justify-around divide-x-2 divide-gray-100 self-center rounded-lg border border-gray-200 text-center shadow-lg">
        <Label label="Street address" value={sample[street]} />
        <Label label="Zone" value={sample[zone]} />
      </section>
    </section>
  );
}

function Label({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 p-4">
      <h4 className="my-0 max-w-xs truncate whitespace-nowrap text-indigo-600">{value ?? '?'}</h4>
      <span className="block text-base whitespace-nowrap text-gray-400">{label}</span>
    </div>
  );
}
