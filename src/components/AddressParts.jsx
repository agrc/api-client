export default function AddressParts() {
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
        prefer the zip code. This data needs to be structured data in a CSV format with a header row.
      </p>
    </section>
  );
}
