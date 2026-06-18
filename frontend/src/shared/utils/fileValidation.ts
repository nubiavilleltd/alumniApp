export const SHARED_UPLOAD_MAX_SIZE_BYTES = 2 * 1024 * 1024;
export const SHARED_UPLOAD_MAX_SIZE_MB = 2;
export const DEFAULT_IMAGE_UPLOAD_ACCEPT =
  '.jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml,image/webp,image/gif';

function getFileExtension(fileName: string) {
  const trimmedName = fileName.trim().toLowerCase();
  const extensionIndex = trimmedName.lastIndexOf('.');

  if (extensionIndex === -1) {
    return '';
  }

  return trimmedName.slice(extensionIndex);
}

function matchesAcceptToken(file: File, token: string) {
  const normalizedToken = token.trim().toLowerCase();
  if (!normalizedToken) {
    return false;
  }

  if (normalizedToken.startsWith('.')) {
    return getFileExtension(file.name) === normalizedToken;
  }

  const normalizedMimeType = file.type.trim().toLowerCase();
  if (!normalizedMimeType) {
    return false;
  }

  if (normalizedToken.endsWith('/*')) {
    const category = normalizedToken.split('/')[0];
    return normalizedMimeType.startsWith(`${category}/`);
  }

  return normalizedMimeType === normalizedToken;
}

function normalizeAcceptTokens(accept: string) {
  return accept
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
}

export function formatAcceptedFileTypes(accept: string) {
  const labels = normalizeAcceptTokens(accept).map((token) => {
    if (token.startsWith('.')) {
      return token.slice(1).toUpperCase();
    }

    if (token.endsWith('/*')) {
      return token.replace('/*', '').toUpperCase();
    }

    const mimeSubtype = token.split('/')[1] ?? token;
    return mimeSubtype.replace('+xml', '').replace(/\./g, ' ').toUpperCase();
  });

  return Array.from(new Set(labels)).join(', ');
}

export function formatFileSizeLimit(maxSizeBytes: number) {
  if (maxSizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(maxSizeBytes / 1024))} KB`;
  }

  const sizeInMb = maxSizeBytes / (1024 * 1024);
  return Number.isInteger(sizeInMb) ? `${sizeInMb} MB` : `${sizeInMb.toFixed(1)} MB`;
}

export function validateFilesAgainstAcceptList(
  files: File[],
  options?: {
    accept?: string;
    maxSizeBytes?: number;
  },
) {
  const accept = options?.accept?.trim() || DEFAULT_IMAGE_UPLOAD_ACCEPT;
  const maxSizeBytes = options?.maxSizeBytes ?? SHARED_UPLOAD_MAX_SIZE_BYTES;
  const acceptTokens = normalizeAcceptTokens(accept);
  const allowedTypesLabel = formatAcceptedFileTypes(accept);
  const validFiles: File[] = [];
  const errors: string[] = [];

  files.forEach((file) => {
    const isAllowedType =
      acceptTokens.length === 0 || acceptTokens.some((token) => matchesAcceptToken(file, token));

    if (!isAllowedType) {
      errors.push(`${file.name}: Only ${allowedTypesLabel} files are allowed.`);
      return;
    }

    if (file.size > maxSizeBytes) {
      errors.push(
        `${file.name}: File size must be ${formatFileSizeLimit(maxSizeBytes)} or smaller.`,
      );
      return;
    }

    validFiles.push(file);
  });

  return { validFiles, errors };
}
