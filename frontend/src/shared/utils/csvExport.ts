// shared/utils/csvExport.ts

/**
 * Escapes a single CSV cell value:
 * - Wraps in quotes and doubles any internal quotes (standard CSV escaping)
 * - Neutralizes formula-injection payloads (=, +, -, @ prefixes) that some
 *   spreadsheet apps (Excel, Google Sheets) will execute on open.
 */
function escapeCsvCell(value: string): string {
  const isFormulaLike = /^[=+\-@]/.test(value);
  const safeValue = isFormulaLike ? `'${value}` : value;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

/**
 * Sanitizes a string for safe use as a filename segment.
 * Strips anything that isn't alphanumeric, collapses to hyphens.
 */
export function sanitizeFilename(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Builds and triggers a CSV file download from tabular data.
 *
 * @param filename   Full filename including .csv extension
 * @param headers    Column headers, in display order
 * @param rows       Array of row objects; missing keys default to ''
 */
export function downloadCsvFile(
  filename: string,
  headers: string[],
  rows: Record<string, string>[],
): void {
  const csvLines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => headers.map((header) => escapeCsvCell(row[header] ?? '')).join(',')),
  ];

  // Leading BOM ensures Excel opens UTF-8 files correctly (accented names, ₦ symbol, etc.)
  const blob = new Blob(['\ufeff', csvLines.join('\r\n')], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}