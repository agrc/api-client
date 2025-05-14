export function AddressParts() {
  return (
    <section className="mt-6">
      <p>The UGRC API requires 2 inputs to geocode. The first is a street address in the form of</p>
      <section className="mb-10 flex w-full items-stretch justify-around divide-x-2 divide-gray-100 rounded-lg border border-gray-200 text-center shadow-lg">
        <Label value="301" label="house number" />
        <Label value="South" label="prefix direction" />
        <Label value="Main" label="street name" />
        <Label value="Street" label="street type or suffix direction" />
      </section>
      <p>
        The second required input is a zone. A zone can be a zip code or a city name. If your data has both available,
        prefer the zip code. This data needs to be structured data in a CSV format with a header row.
      </p>
    </section>
  );
}

function Label({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 p-4">
      <h2 className="mb-0 text-indigo-600">{value}</h2>
      <span className="block text-base text-gray-400">{label}</span>
    </div>
  );
}
