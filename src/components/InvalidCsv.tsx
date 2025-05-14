const errors = {
  CSV_RECORD_INCONSISTENT_COLUMNS:
    'that a record did not contain the same amount of fields as the previous record. Somewhere in the file, a row is missing or has extra field delimiters.',
  CSV_INVALID_CLOSING_QUOTE: 'a quote in an unexpected location. Please check the quotes in the CSV file.',
  CSV_RECORD_INCONSISTENT_FIELDS_LENGTH:
    'that a record did not contain the same amount of fields as the previous record. Somewhere in the file, a row is missing or has extra field delimiters.',
  CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH:
    'that a record did not contain the same amount of columns. Somewhere in the file, a row is missing or has extra field delimiters.',
  CSV_QUOTE_NOT_CLOSED: 'an open quote that was not closed. Please check the quotes in the CSV file.',
  INVALID_OR_EMPTY_FILE: 'no records. The file is empty or invalid.',
};

export const CSV_PARSE_ERROR = 'CSV_PARSE_ERROR';

export function InvalidCsv({ errorDetails }: { errorDetails: string[] }) {
  let message = 'something we have never seen before. Good luck and try again!';

  const [code, stack] = errorDetails;

  if (Object.keys(errors).includes(code)) {
    message = errors[code as keyof typeof errors];
  }

  return (
    <div className="my-4 w-full rounded border-3 border-amber-800 bg-amber-50 px-4 shadow">
      <h2 className="text-center text-amber-500">Woops, that CSV is not valid</h2>
      <p>The file you selected has some problems that you will need to correct before we can continue.</p>
      <p>We found {message}</p>
      {stack && (
        <>
          <label htmlFor="stack">Stack trace:</label>
          <pre id="stack" className="overflow-auto text-base text-gray-400">
            {stack}
          </pre>
        </>
      )}
    </div>
  );
}
