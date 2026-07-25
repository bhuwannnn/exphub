import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { fileToCompressedDataUrl } from '@/lib/image-upload';

export function ImageField({
  label,
  value,
  onChange,
  maxWidth = 640,
}: {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  maxWidth?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file, maxWidth);
      onChange(dataUrl);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink/60">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-line">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white"
              aria-label="Remove image"
            >
              <X size={11} />
            </button>
          </div>
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-lg border border-dashed border-line text-ink/30">
            <Upload size={16} />
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-ink hover:border-ink disabled:opacity-50"
        >
          {busy ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>
    </div>
  );
}
