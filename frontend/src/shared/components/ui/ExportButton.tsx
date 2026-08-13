// shared/components/ui/ExportButton.tsx
import { useState } from 'react';
import { Download, LoaderCircle } from 'lucide-react';

interface ExportButtonProps {
  onExport: () => Promise<void> | void;
  /** Disable regardless of internal exporting state — e.g. no data yet, or parent is still loading */
  disabled?: boolean;
  label?: string;
  exportingLabel?: string;
  className?: string;
}

export function ExportButton({
  onExport,
  disabled = false,
  label = 'Export',
  exportingLabel = 'Exporting...',
  className = '',
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleClick = async () => {
    if (isExporting || disabled) return;

    setIsExporting(true);
    try {
      await onExport();
    } finally {
      setIsExporting(false);
    }
  };

  const isDisabled = disabled || isExporting;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`inline-flex items-center gap-2 rounded-full border-2 border-primary-500 px-5 py-2.5 text-sm font-semibold text-primary-500 transition-colors hover:bg-primary-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary-500 ${className}`}
    >
      <span>{isExporting ? exportingLabel : label}</span>
      {isExporting ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" strokeWidth={2.4} />
      )}
    </button>
  );
}