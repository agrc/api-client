import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import DropzoneMessaging from '../components/DropzoneMessaging.jsx';
import FieldLinker from '../components/FieldLinker.jsx';
import ApiKey from '../components/ApiKey.jsx';
import { useGeocodeContext } from '../components/GeocodeContext.js';

const acceptableFileTypes = ['.csv'];

const chooseCommonFieldName = (fieldName, fieldsFromFile, commonFieldNames) => {
  if (!fieldName) return;

  if (!['street', 'zone'].includes(fieldName)) {
    return '';
  }

  const filtered = fieldsFromFile.filter((field) => commonFieldNames[fieldName].includes(field.toLowerCase()));

  return filtered.length > 0 ? filtered[0] : '';
};

export default function Data() {
  const [geocodeContext, setGeocodeContext] = useGeocodeContext();
  const [fieldList, setFieldList] = useState([]);
  const onDrop = async (files) => {
    if (!files) {
      setGeocodeContext({ file: null });

      return;
    }

    const file = files[0];
    const fieldsFromFile = await window.ugrc.getFieldsFromFile(file.path);

    setFieldList(fieldsFromFile);

    setGeocodeContext({
      file,
      fields: {
        street: chooseCommonFieldName('street', fieldsFromFile, commonFieldNames.current),
        zone: chooseCommonFieldName('zone', fieldsFromFile, commonFieldNames.current),
      },
    });
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    maxFiles: 1,
    accept: acceptableFileTypes.join(),
    onDrop,
  });
  const commonFieldNames = useRef({
    street: [],
    zone: [],
  });
  const history = useHistory();

  useEffect(() => {
    window.ugrc.getConfigItem('streetFields').then((f) => (commonFieldNames.current.street = f));
    window.ugrc.getConfigItem('zoneFields').then((f) => (commonFieldNames.current.zone = f));
  }, []);

  const saveFieldPreferences = async () => {
    const existingStreetFields = new Set(await window.ugrc.getConfigItem('streetFields'));

    existingStreetFields.add(geocodeContext.fields.street.toLowerCase());

    const existingZoneFields = new Set(await window.ugrc.getConfigItem('zoneFields'));

    existingZoneFields.add(geocodeContext.fields.zone.toLowerCase());

    await window.ugrc.saveConfig({
      streetFields: Array.from(existingStreetFields),
      zoneFields: Array.from(existingZoneFields),
    });

    history.push('/plan');
  };

  return (
    <>
      <ApiKey />
      <Link
        className="px-4 py-1 text-white bg-indigo-400 border border-indigo-600 rounded shadow"
        to="/?skip-forward=1"
      >
        &larr; Back
      </Link>
      <h1 className="my-6 text-3xl">Add your data</h1>
      <p className="mb-2 text-base">This data needs to be structured data in a CSV format, ideally with a header row</p>
      <div
        {...getRootProps()}
        className="flex items-center justify-center w-full mb-4 bg-gray-100 border border-indigo-800 rounded shadow h-28"
      >
        <input {...getInputProps()} />
        <DropzoneMessaging isDragActive={isDragActive} file={geocodeContext.file} />
      </div>
      {geocodeContext.file ? (
        <button
          type="button"
          onClick={() => {
            onDrop(null);
          }}
        >
          <span className="self-center justify-between">Clear</span>
        </button>
      ) : (
        <button type="button" onClick={open}>
          <span className="self-center justify-between">Choose File</span>
        </button>
      )}

      {geocodeContext.file ? <FieldLinker fieldList={fieldList} /> : null}

      {geocodeContext.fields.street && geocodeContext.fields.zone ? (
        <button className="mt-4" onClick={saveFieldPreferences} type="button">
          Next
        </button>
      ) : null}
    </>
  );
}
