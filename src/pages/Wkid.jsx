import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { useErrorBoundary } from 'react-error-boundary';

export default function Wkid() {
  const [wkid, setWkid] = useState('');
  const [customWkid, setCustomWkid] = useState('');
  const history = useHistory();
  const handleError = useErrorBoundary();

  useEffect(() => {
    window.ugrc
      .getConfigItem('wkid')
      .then((id) => {
        if ([26912, 4326, 3857].includes(id)) {
          setWkid(id?.toString());
        } else {
          setCustomWkid(id?.toString());
        }
      })
      .catch(handleError);
  }, [handleError]);
  return (
    <article>
      <Link type="back-button" to="/data">
        &larr; Back
      </Link>
      <h2 className="text-zinc-700">Choose your spatial reference</h2>
      <p className="mb-2 text-base">
        The way the coordinates are returned from the API can vary based on the spatial reference. They can be returned
        as meters, feet, or decimal degrees. Below are the three most used spatial references. If you require something
        different, please add the wkid.
      </p>
      <RadioGroup
        value={wkid}
        onChange={(value) => {
          setCustomWkid('');
          setWkid(value);
        }}
      >
        <section className="mt-4 grid w-full grid-cols-3 justify-items-center text-center">
          <RadioGroup.Option value="26912">
            {({ checked }) => (
              <div
                className={clsx(
                  'm-2 flex h-48 w-48 flex-1 cursor-pointer flex-col justify-center rounded-full p-6 ring-4',
                  {
                    'ring-gray-300': !checked,
                    'bg-gray-50 ring-pink-400': checked,
                  },
                )}
              >
                <h2 className="my-0 text-indigo-600">26912</h2>
                <span className="block text-xs tracking-tighter text-indigo-900">(425602.11, 4513491.02)</span>
                <span className="block text-base text-gray-400">UTM Zone 12 North (state standard)</span>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="4326">
            {({ checked }) => (
              <div
                className={clsx(
                  'm-2 flex h-48 w-48 flex-1 cursor-pointer flex-col justify-center rounded-full p-6 ring-4',
                  {
                    'ring-gray-300': !checked,
                    'bg-gray-50 ring-pink-400': checked,
                  },
                )}
              >
                <h2 className="my-0 text-indigo-600">4326</h2>
                <span className="block text-xs tracking-tighter text-indigo-900">(-111.88, 40.76)</span>
                <span className="block text-base text-gray-400">WGS 84 (lat/lon)</span>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="3857">
            {({ checked }) => (
              <div
                className={clsx(
                  'm-2 flex h-48 w-48 flex-1 cursor-pointer flex-col justify-center rounded-full p-6 ring-4',
                  {
                    'ring-gray-300': !checked,
                    'bg-gray-50 ring-pink-400': checked,
                  },
                )}
              >
                <h2 className="my-0 text-indigo-600">3857</h2>
                <span className="block text-xs tracking-tighter text-indigo-900">(-12454597.87, 4978333.39)</span>
                <span className="block text-base text-gray-400">Web Mercator (web mapping)</span>
              </div>
            )}
          </RadioGroup.Option>
          <div className="col-span-3 flex-1 self-center p-6">
            <label htmlFor="customWkid">
              <input
                type="number"
                name="customWkid"
                value={customWkid}
                onChange={(event) => {
                  setWkid(null);
                  setCustomWkid(event.target.value);
                }}
                placeholder="wkid"
              />
            </label>
            <span className="block text-base text-gray-400">other</span>
          </div>
        </section>
      </RadioGroup>
      {wkid || customWkid ? (
        <button
          className="mt-4"
          onClick={() => {
            window.ugrc.saveConfig({ wkid: parseInt(wkid || customWkid) }).catch(handleError);

            history.push('/plan');
          }}
          type="button"
        >
          Next
        </button>
      ) : null}
    </article>
  );
}
