import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { useErrorHandler } from 'react-error-boundary';

export default function Wkid() {
  const [wkid, setWkid] = useState('');
  const [customWkid, setCustomWkid] = useState('');
  const history = useHistory();
  const handleError = useErrorHandler();

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
      <h2>Choose your spatial reference</h2>
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
        <section className="grid w-full grid-cols-3 mt-4 text-center justify-items-center">
          <RadioGroup.Option value="26912">
            {({ checked }) => (
              <div
                className={clsx(
                  'cursor-pointer ring-4 rounded-full m-2 flex flex-col w-48 h-48 justify-center flex-1 p-6',
                  {
                    'ring-gray-300': !checked,
                    'bg-gray-50 ring-pink-400': checked,
                  }
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
                  'cursor-pointer ring-4 rounded-full m-2 flex flex-col w-48 h-48 justify-center flex-1 p-6',
                  {
                    'ring-gray-300': !checked,
                    'bg-gray-50 ring-pink-400': checked,
                  }
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
                  'cursor-pointer ring-4 rounded-full m-2 flex flex-col w-48 h-48 justify-center flex-1 p-6',
                  {
                    'ring-gray-300': !checked,
                    'bg-gray-50 ring-pink-400': checked,
                  }
                )}
              >
                <h2 className="my-0 text-indigo-600">3857</h2>
                <span className="block text-xs tracking-tighter text-indigo-900">(-12454597.87, 4978333.39)</span>
                <span className="block text-base text-gray-400">Web Mercator (web mapping)</span>
              </div>
            )}
          </RadioGroup.Option>
          <div className="self-center flex-1 col-span-3 p-6">
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
            window.ugrc.saveConfig({ wkid: parseInt(wkid || customWkid) });

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
