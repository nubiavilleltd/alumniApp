// import { useRef } from 'react';
// import { Icon } from '@iconify/react';

// interface ImageUploadProps {
//   previews: string[];
//   onChange: (files: File[], previews: string[]) => void;
//   label?: string;
//   error?: string;
//   hint?: string;
//   accept?: string;
//   multiple?: boolean;
// }

// export function ImageUpload({
//   previews,
//   onChange,
//   label,
//   error,
//   hint = 'PNG or JPG (max 800×400px)',
//   accept = 'image/png,image/jpeg',
//   multiple = true,
// }: ImageUploadProps) {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files ?? []);
//     const urls = files.map((f) => URL.createObjectURL(f));
//     onChange(files, urls);
//   };

//   const removePreview = (index: number) => {
//     const newPreviews = previews.filter((_, i) => i !== index);
//     onChange([], newPreviews);
//   };

//   return (
//     <div className="flex flex-col gap-1">
//       {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

//       {/* Drop zone */}
//       <button
//         type="button"
//         onClick={() => fileInputRef.current?.click()}
//         className={`w-full border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-2 transition-colors group
//           ${error ? 'border-red-400' : 'border-gray-200 hover:border-primary-400'}
//         `}
//       >
//         <Icon
//           icon="mdi:camera-outline"
//           className={`w-8 h-8 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-hover:text-primary-400'}`}
//         />
//         <span className="text-primary-500 text-sm font-medium">Click to upload image</span>
//         <span className="text-gray-400 text-xs">{hint}</span>
//       </button>

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept={accept}
//         multiple={multiple}
//         className="hidden"
//         onChange={handleChange}
//       />

//       {/* Previews — X button always visible for mobile friendliness */}
//       {previews.length > 0 && (
//         <div className="flex gap-2 mt-2 flex-wrap">
//           {previews.map((src, i) => (
//             <div key={i} className="relative">
//               <img
//                 src={src}
//                 alt={`preview-${i}`}
//                 className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//               />
//               <button
//                 type="button"
//                 onClick={() => removePreview(i)}
//                 className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center transition-colors"
//               >
//                 <Icon icon="mdi:close" className="w-2.5 h-2.5" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {error && (
//         <p className="text-xs text-red-500 flex items-center gap-1">
//           <Icon icon="mdi:alert-circle-outline" className="w-3 h-3" />
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }

import { useRef, useState } from 'react';
import { Icon } from '@iconify/react';

interface ImageUploadProps {
  previews: string[];
  onChange: (files: File[], previews: string[]) => void;
  label?: string;
  error?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
}

export function ImageUpload({
  previews,
  onChange,
  label,
  error,
  hint = 'PNG or JPG (max 800×400px, up to 2MB)',
  accept = 'image/png,image/jpeg,image/webp,image/gif',
  multiple = true,
  maxSizeMB = 2,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const allowedTypes = accept.split(',').map((t) => t.trim());

    for (const file of files) {
      // Check file type
      const fileType = file.type;
      const isAllowedType = allowedTypes.some((type) => {
        // Handle wildcard types like 'image/*'
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return fileType.startsWith(`${category}/`);
        }
        return type === fileType;
      });

      if (!isAllowedType) {
        errors.push(`${file.name}: Only ${allowedTypes.join(', ')} files are allowed`);
        continue;
      }

      // Check file size
      if (file.size > maxSizeBytes) {
        errors.push(`${file.name}: File size must be less than ${maxSizeMB}MB`);
        continue;
      }

      valid.push(file);
    }

    return { valid, errors };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    // Validate files
    const { valid, errors } = validateFiles(files);

    // Show first error to user
    if (errors.length > 0) {
      setValidationError(errors[0]);
    } else {
      setValidationError(null);
    }

    if (valid.length === 0) {
      // Clear the input so user can try again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Create preview URLs for valid files
    const urls = valid.map((f) => URL.createObjectURL(f));

    // If multiple is false, replace existing previews
    if (!multiple && previews.length > 0) {
      // Clean up old preview URLs to prevent memory leaks
      previews.forEach((url) => URL.revokeObjectURL(url));
    }

    onChange(valid, urls);

    // Clear the input so same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePreview = (index: number) => {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);

    const newPreviews = previews.filter((_, i) => i !== index);
    onChange([], newPreviews);
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
    <div className="flex flex-col gap-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-2 transition-colors group
          ${error || validationError ? 'border-red-400' : 'border-gray-200 hover:border-primary-400'}
        `}
      >
        <Icon
          icon="mdi:camera-outline"
          className={`w-8 h-8 transition-colors ${error || validationError ? 'text-red-400' : 'text-gray-400 group-hover:text-primary-400'}`}
        />
        <span className="text-primary-500 text-sm font-medium">Click to upload image</span>
        <span className="text-gray-400 text-xs">{hint}</span>
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
                <Icon icon="mdi:close" className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {(error || validationError) && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <Icon icon="mdi:alert-circle-outline" className="w-3 h-3" />
          {error || validationError}
        </p>
      )}
    </div>
  );
}
