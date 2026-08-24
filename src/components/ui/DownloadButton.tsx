import { FaDownload } from "react-icons/fa6";

import type { ImageFormat } from "../../lib/exportImage";
import type { UseImageDownloadResult } from "../../hooks/useImageDownload";

const FORMATS: { format: ImageFormat; label: string }[] = [
  { format: "png", label: "PNG" },
  { format: "jpeg", label: "JPG" },
];

interface DownloadButtonProps {
  busyFormat: UseImageDownloadResult["busyFormat"];
  notice: UseImageDownloadResult["notice"];
  onDownload: (format: ImageFormat) => void;
}

/**
 * Saves the card on screen as an image. Two buttons rather than a dropdown —
 * there are only two formats, and the toolbar already reads as a row of chips.
 */
const DownloadButton = ({ busyFormat, notice, onDownload }: DownloadButtonProps) => {
  const isBusy = busyFormat !== null;

  return (
    <div className="relative hidden md:flex items-center gap-2">

      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-gray-500">
        <FaDownload aria-hidden="true" />
        Save
      </span>

      <div className="flex overflow-hidden rounded-md border border-white/20 bg-[#12122a] font-mono">
        {FORMATS.map(({ format, label }, index) => (
          <button
            key={format}
            type="button"
            onClick={() => onDownload(format)}
            disabled={isBusy}
            aria-busy={busyFormat === format}
            title={`Download this spotlight as ${label}`}
            className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:hover:bg-transparent ${
              index > 0 ? "border-l border-white/20" : ""
            } ${busyFormat === format ? "text-[#f4f348]" : isBusy ? "opacity-40" : ""}`}
          >
            {busyFormat === format ? "…" : label}
          </button>
        ))}
      </div>

      {/* Result note — floats so it never nudges the toolbar. */}
      {notice && (
        <p
          aria-live="polite"
          className={`absolute right-0 top-full z-10 mt-1.5 max-w-[70vw] truncate rounded bg-[#12122a] px-2 py-1 font-mono text-[10px] ${
            notice.tone === "ok" ? "text-[#4ade80]" : "text-[#f6b8d9]"
          }`}
        >
          {notice.text}
        </p>
      )}

    </div>
  );
};

export default DownloadButton;
