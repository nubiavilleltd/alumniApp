import { useState } from "react";
import { toast } from "./Toast";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Text successfully copied")
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy to clipboard"
      className="text-primary-500 hover:text-primary-600 transition-colors flex-shrink-0"
    >
      {copied ? (
        <Check className="w-4 h-4" strokeWidth={2.4} />
      ) : (
        <Copy className="w-4 h-4" strokeWidth={2.4} />
      )}
    </button>
  );
}