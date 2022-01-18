import { useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { DocumentAddIcon, DocumentRemoveIcon } from '@heroicons/react/outline';
import DropzoneMessaging from '../components/DropzoneMessaging.jsx';
import FieldLinker from '../components/FieldLinker.jsx';
import { useGeocodeContext } from '../components/GeocodeContext.js';
import AddressParts from '../components/AddressParts.jsx';
import SampleFieldData from '../components/SampleFieldData.jsx';

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
  const { geocodeContext, geocodeDispatch } = useGeocodeContext();

  const onDrop = async (files) => {
    if (!files) {
      geocodeDispatch({
        type: 'RESET',
        payload: 'data',
      });

      return;
    }

    window.ugrc.trackEvent({
      category: 'file-selection-type',
      label: 'drag and drop',
    });

    const file = files[0];
    const newSample = await window.ugrc.getSampleFromFile(file.path);
    const fields = Object.keys(newSample);

    geocodeDispatch({
      type: 'UPDATE_FILE',
      payload: {
        file,
        fieldsFromFile: fields,
        street: chooseCommonFieldName('street', fields, commonFieldNames.current),
        zone: chooseCommonFieldName('zone', fields, commonFieldNames.current),
        sampleData: newSample,
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

    existingStreetFields.add(geocodeContext.data.street.toLowerCase());

    const existingZoneFields = new Set(await window.ugrc.getConfigItem('zoneFields'));

    existingZoneFields.add(geocodeContext.data.zone.toLowerCase());

    await window.ugrc.saveConfig({
      streetFields: Array.from(existingStreetFields),
      zoneFields: Array.from(existingZoneFields),
    });

    history.push('/wkid');
  };

  return (
    <article>
      <Link type="back-button" to="/?skip-forward=1">
        &larr; Back
      </Link>
      <h2>Add your data</h2>
      <AddressParts />
      <div
        {...getRootProps()}
        className="flex items-center justify-center w-full mb-4 bg-gray-100 border border-indigo-800 rounded shadow h-28"
      >
        <input {...getInputProps()} />
        <DropzoneMessaging isDragActive={isDragActive} file={geocodeContext.data.file} />
      </div>
      {geocodeContext.data.file ? (
        <button
          className="flex flex-row"
          type="button"
          onClick={() => {
            onDrop(null);
          }}
        >
          <DocumentRemoveIcon className="self-center justify-between inline-block w-6 h-6 mr-2" />
          Clear
        </button>
      ) : (
        <button className="flex flex-row" type="button" onClick={open}>
          <DocumentAddIcon className="self-center justify-between inline-block w-6 h-6 mr-2" />
          Choose File
        </button>
      )}
      {geocodeContext.data.file && geocodeContext.data.sampleData ? (
        <>
          <FieldLinker />
          <SampleFieldData
            street={geocodeContext.data.street}
            zone={geocodeContext.data.zone}
            sample={geocodeContext.data.sampleData}
          />
        </>
      ) : null}

      {geocodeContext.data.street && geocodeContext.data.zone ? (
        <button className="mt-4" onClick={saveFieldPreferences} type="button">
          Next
        </button>
      ) : null}
    </article>
  );
}
