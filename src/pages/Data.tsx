import { FileMinus2Icon, FilePlus2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useErrorBoundary } from 'react-error-boundary';
import { Link, useNavigate } from 'react-router';
import { useGeocodeContext } from '../components/GeocodeContext';
import { CSV_PARSE_ERROR, InvalidCsv } from '../components/InvalidCsv';
import { AddressParts, DropzoneMessaging, FieldLinker, SampleFieldData, Spinner } from '../components/PageElements';

const acceptableFileTypes = ['.csv'];

const getCsvErrorDetails = (error: unknown) => {
  if (!(error instanceof Error) || !error.message.includes(CSV_PARSE_ERROR)) {
    return null;
  }

  const details: string[] = [];
  error.message.replace(/\{(.*?)\}/g, (_, code: string) => {
    details.push(code);

    return code;
  });

  return details;
};

const chooseCommonFieldName = (fieldName, fieldsFromFile, commonFieldNames) => {
  if (!fieldName) return;

  if (!['street', 'zone'].includes(fieldName)) {
    return '';
  }

  const filtered = fieldsFromFile.filter((field) => commonFieldNames[fieldName].includes(field.toLowerCase()));

  return filtered.length > 0 ? filtered[0] : '';
};

const getLocalCsvPath = async (file: File & { path?: string }) => {
  const resolvedPath = window.ugrc.webFilePath(file);
  if (resolvedPath) {
    return resolvedPath;
  }

  const arrayBuffer = await file.arrayBuffer();

  try {
    return await window.ugrc.saveDroppedFile({
      name: file.name,
      bytes: new Uint8Array(arrayBuffer),
    });
  } catch (error) {
    // In development, renderer can hot-reload while the main process still runs older IPC handlers.
    if (error instanceof Error && error.message.includes("No handler registered for 'saveDroppedFile'")) {
      return '';
    }

    throw error;
  }
};

export function Data() {
  const { geocodeContext, geocodeDispatch } = useGeocodeContext();
  const [error, setError] = useState<string[] | undefined>();
  const [validation, setValidation] = useState<'validating' | 'valid' | 'invalid' | 'idle'>('idle');

  const onDrop = async (files: File[] | null, _: unknown, event: { type?: string } | unknown) => {
    if (!files || files.length === 0) {
      geocodeDispatch({ type: 'RESET', payload: 'data' });

      return;
    }

    window.ugrc.trackEvent({
      category: 'file-selection-type',
      label: ((event as { type?: string })?.type ?? '') === 'drop' ? 'drag-and-drop' : 'file-dialog',
    });

    let file = '';

    try {
      file = await getLocalCsvPath(files[0] as File & { path?: string });
    } catch {
      setError(['INVALID_FILE_PATH', 'We could not read that file from your local filesystem.']);

      return;
    }

    if (!file) {
      setError(['INVALID_FILE_PATH', 'We could not read that file from your local filesystem.']);

      return;
    }

    setError(undefined);
    let stats: { firstRecord: Record<string, unknown>; totalRecords: number } | undefined;
    try {
      stats = await window.ugrc.getCsvColumns(file);
    } catch (e) {
      const errorDetails = getCsvErrorDetails(e);
      if (errorDetails) {
        setError(errorDetails);

        return;
      }
      showBoundary(e);
      return;
    }

    if (!stats) return;

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

      const errorDetails = getCsvErrorDetails(e);
      if (errorDetails) {
        setError(errorDetails);

        return;
      }
      showBoundary(e);
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
  const commonFieldNames = useRef({ street: [] as string[], zone: [] as string[] });
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

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
      .then((f) => (commonFieldNames.current.street = f as string[]))
      .catch((err) => showBoundary(err));
    window.ugrc
      .getConfigItem('zoneFields')
      .then((f) => (commonFieldNames.current.zone = f as string[]))
      .catch((err) => showBoundary(err));
  }, [showBoundary]);

  const saveFieldPreferences = async () => {
    const existingStreetFields = new Set<string>(
      (await window.ugrc.getConfigItem('streetFields').catch(() => [])) as string[],
    );

    existingStreetFields.add(geocodeContext.data.street.toLowerCase());

    const existingZoneFields = new Set<string>(
      (await window.ugrc.getConfigItem('zoneFields').catch(() => [])) as string[],
    );

    existingZoneFields.add(geocodeContext.data.zone.toLowerCase());

    await window.ugrc
      .saveConfig({ streetFields: Array.from(existingStreetFields), zoneFields: Array.from(existingZoneFields) })
      .catch((err) => showBoundary(err));

    navigate('/wkid');
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
            onDrop(null, null, null);
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
