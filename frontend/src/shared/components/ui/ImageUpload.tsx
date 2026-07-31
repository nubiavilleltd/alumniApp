import { useRef, useState, type DragEvent as ReactDragEvent } from 'react';
import {
  DEFAULT_IMAGE_UPLOAD_ACCEPT,
  SHARED_UPLOAD_MAX_SIZE_MB,
  formatAcceptedFileTypes,
  formatFileSizeLimit,
  validateFilesAgainstAcceptList,
} from '@/shared/utils/fileValidation';
import { renderIcon, type AppIcon } from '@/shared/utils/renderIcon';

interface ImageUploadProps {
  previews: string[];
  onChange: (
    files: File[],
    previews: string[],
    change?: { type: 'replace' } | { type: 'remove'; index: number },
  ) => void;
  label?: string;
  error?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  className?: string;
  labelClassName?: string;
  dropzoneClassName?: string;
  idleIcon?: AppIcon;
  activeIcon?: AppIcon;
  removeIcon?: AppIcon;
  errorIcon?: AppIcon;
}

export function ImageUpload({
  previews,
  onChange,
  label,
  error,
  hint,
  accept = DEFAULT_IMAGE_UPLOAD_ACCEPT,
  multiple = true,
  maxSizeMB = SHARED_UPLOAD_MAX_SIZE_MB,
  className = '',
  labelClassName = '',
  dropzoneClassName = '',
  idleIcon = 'mdi:camera-outline',
  activeIcon = 'mdi:tray-arrow-down',
  removeIcon = 'mdi:close',
  errorIcon = 'mdi:alert-circle-outline',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const resolvedHint =
    hint ?? `${formatAcceptedFileTypes(accept)} up to ${formatFileSizeLimit(maxSizeBytes)}`;

  const processFiles = (files: File[]) => {
    const { validFiles, errors } = validateFilesAgainstAcceptList(files, {
      accept,
      maxSizeBytes,
    });

    if (errors.length > 0) {
      setValidationError(errors[0]);
    } else {
      setValidationError(null);
    }

    if (validFiles.length === 0) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const urls = validFiles.map((file) => URL.createObjectURL(file));

    if (!multiple && previews.length > 0) {
      previews.forEach((url) => URL.revokeObjectURL(url));
    }

    onChange(validFiles, urls, { type: 'replace' });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(Array.from(e.target.files ?? []));
  };

  const isDraggingFiles = (event: ReactDragEvent<HTMLElement>) =>
    Array.from(event.dataTransfer.types).includes('Files');

  const handleDragEnter = (event: ReactDragEvent<HTMLButtonElement>) => {
    if (!isDraggingFiles(event)) {
      return;
    }

    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragOver = (event: ReactDragEvent<HTMLButtonElement>) => {
    if (!isDraggingFiles(event)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (event: ReactDragEvent<HTMLButtonElement>) => {
    if (!isDraggingFiles(event)) {
      return;
    }

    event.preventDefault();
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }

    setIsDragActive(false);
  };

  const handleDrop = (event: ReactDragEvent<HTMLButtonElement>) => {
    if (!isDraggingFiles(event)) {
      return;
    }

    event.preventDefault();
    setIsDragActive(false);
    processFiles(Array.from(event.dataTransfer.files ?? []));
  };

  const removePreview = (index: number) => {
    if (previews[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(previews[index]);
    }

    const newPreviews = previews.filter((_, i) => i !== index);
    onChange([], newPreviews, { type: 'remove', index });
  };

  // Clean up preview URLs when component unmounts or previews change
  const handleCleanup = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
  };

  // Set up cleanup on unmount
  const ref = useRef(handleCleanup);
  ref.current = handleCleanup;

  useRef(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  });

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className={`block text-sm font-medium text-gray-700 ${labelClassName}`}>
          {label}
        </label>
      )}

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-2 transition-colors group
          ${
            error || validationError
              ? 'border-red-400'
              : isDragActive
                ? 'border-primary-400 bg-primary-50/50'
                : 'border-gray-200 hover:border-primary-400'
          }
          ${dropzoneClassName}
        `}
      >
        {renderIcon(
          isDragActive ? activeIcon : idleIcon,
          `h-8 w-8 transition-colors ${
            error || validationError ? 'text-red-400' : 'text-primary-500 group-hover:text-primary-400'
          }`,
        )}
        <span className="text-primary-500 text-sm font-medium">
          {isDragActive ? 'Drop image here' : 'Click or drag image here'}
        </span>
        <span className="text-gray-400 text-xs">{resolvedHint}</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />

      {/* Previews — X button always visible for mobile friendliness */}
      {previews.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {previews.map((src, i) => (
            <div key={i} className="relative">
              <img
                src={src}
                alt={`preview-${i}`}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removePreview(i)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center transition-colors"
              >
                {renderIcon(removeIcon, 'h-2.5 w-2.5')}
              </button>
            </div>
          ))}
        </div>
      )}

      {(error || validationError) && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          {renderIcon(errorIcon, 'h-3 w-3')}
          {error || validationError}
        </p>
      )}
    </div>
  );
}
