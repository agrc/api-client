import { FileMinus2Icon, FilePlus2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useErrorBoundary } from 'react-error-boundary';
import { Link, useHistory } from 'react-router-dom';
import { useGeocodeContext } from '../components/GeocodeContext';
import { CSV_PARSE_ERROR, InvalidCsv } from '../components/InvalidCsv';
import { AddressParts, DropzoneMessaging, FieldLinker, SampleFieldData, Spinner } from '../components/PageElements';

const acceptableFileTypes = ['.csv'];

const chooseCommonFieldName = (fieldName, fieldsFromFile, commonFieldNames) => {
  if (!fieldName) return;

  if (!['street', 'zone'].includes(fieldName)) {
    return '';
  }

  const filtered = fieldsFromFile.filter((field) => commonFieldNames[fieldName].includes(field.toLowerCase()));

  return filtered.length > 0 ? filtered[0] : '';
};

export function Data() {
  const { geocodeContext, geocodeDispatch } = useGeocodeContext();
  const [error, setError] = useState();
  const [validation, setValidation] = useState('idle');

  const onDrop = async (files, _, event) => {
    if (!files) {
      geocodeDispatch({ type: 'RESET', payload: 'data' });

      return;
    }

    window.ugrc.trackEvent({
      category: 'file-selection-type',
      label: (event?.type ?? '') === 'drop' ? 'drag-and-drop' : 'file-dialog',
    });

    const file = window.ugrc.webFilePath(files[0]);

    setError();
    let stats;
    try {
      stats = await window.ugrc.getCsvColumns(file);
    } catch (e) {
      const errorDetails = [];
      if (e.message.includes(CSV_PARSE_ERROR)) {
        e.message.replace(/\{(.*?)\}/g, (_, code) => {
          errorDetails.push(code);
        });

        setError(errorDetails);

        return;
      }
      handleError(e);
    }

    const fields = Object.keys(stats.firstRecord);

    geocodeDispatch({
      type: 'UPDATE_FILE',
      payload: {
        file,
        fieldsFromFile: fields,
        street: chooseCommonFieldName('street', fields, commonFieldNames.current),
        zone: chooseCommonFieldName('zone', fields, commonFieldNames.current),
        sampleData: stats.firstRecord,
        totalRecords: '-',
        valid: null,
      },
    });

    try {
      setValidation('validating');
      stats = await window.ugrc.validateWithStats(file);
      geocodeDispatch({ type: 'UPDATE_FILE', payload: { totalRecords: stats.totalRecords, valid: true } });
      setValidation('idle');
    } catch (e) {
      geocodeDispatch({ type: 'UPDATE_FILE', payload: { valid: false } });
      setValidation('idle');

      const errorDetails = [];
      if (e.message.includes(CSV_PARSE_ERROR)) {
        e.message.replace(/\{(.*?)\}/g, (_, code) => {
          errorDetails.push(code);
        });

        setError(errorDetails);

        return;
      }
      handleError(e);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    maxFiles: 1,
    accept: { 'text/csv': acceptableFileTypes },
    onDrop,
    useFsAccessApi: false,
  });
  const commonFieldNames = useRef({ street: [], zone: [] });
  const history = useHistory();
  const handleError = useErrorBoundary();

  useEffect(() => {
    window.addEventListener('keyup', (event) => {
      if (event.ctrlKey && event.key === 'o') {
        open();
      }
    });
  }, [open, geocodeDispatch]);

  useEffect(() => {
    window.ugrc
      .getConfigItem('streetFields')
      .then((f) => (commonFieldNames.current.street = f))
      .catch(handleError);
    window.ugrc
      .getConfigItem('zoneFields')
      .then((f) => (commonFieldNames.current.zone = f))
      .catch(handleError);
  }, [handleError]);

  const saveFieldPreferences = async () => {
    const existingStreetFields = new Set(await window.ugrc.getConfigItem('streetFields').catch(handleError));

    existingStreetFields.add(geocodeContext.data.street.toLowerCase());

    const existingZoneFields = new Set(await window.ugrc.getConfigItem('zoneFields').catch(handleError));

    existingZoneFields.add(geocodeContext.data.zone.toLowerCase());

    await window.ugrc
      .saveConfig({ streetFields: Array.from(existingStreetFields), zoneFields: Array.from(existingZoneFields) })
      .catch(handleError);

    history.push('/wkid');
  };

  return (
    <article>
      <Link type="back-button" to="/?skip-forward=1">
        &larr; Back
      </Link>
      <h2 className="text-zinc-700">Add your data</h2>
      <AddressParts />
      {}
      {error && <InvalidCsv errorDetails={error} />}
      <div
        {...getRootProps()}
        className="mb-4 flex h-28 w-full items-center justify-center rounded border border-indigo-800 bg-gray-100 shadow"
      >
        <input {...getInputProps()} />
        <DropzoneMessaging isDragActive={isDragActive} file={geocodeContext.data.file} validation={validation} />
      </div>
      {geocodeContext.data.file ? (
        <button
          className="flex flex-row"
          type="button"
          onClick={() => {
            onDrop(null);
          }}
        >
          <FileMinus2Icon className="mr-2 inline-block size-6 justify-between self-center" />
          Clear
        </button>
      ) : (
        <button className="flex flex-row" type="button" onClick={open}>
          <FilePlus2Icon className="mr-2 inline-block size-6 justify-between self-center" />
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
        <button type="button" className="mt-4" onClick={saveFieldPreferences} disabled={!geocodeContext.data.valid}>
          {validation === 'validating' ? (
            <span className="flex">
              <span className="mr-2">Checking CSV</span>
              <Spinner />
            </span>
          ) : (
            'Next'
          )}
        </button>
      ) : null}
    </article>
  );
}
