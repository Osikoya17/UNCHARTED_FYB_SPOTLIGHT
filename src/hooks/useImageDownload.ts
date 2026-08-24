import { useRef, useState, type RefObject } from "react";

import {
  downloadNodeAsImage,
  type ExportOptions,
  type ImageFormat,
} from "../lib/exportImage";

/** How long a "saved" / "problem" note stays on screen before clearing. */
const NOTICE_MS = 4000;

export interface UseImageDownloadResult {
  /** Attach to the element you want captured. */
  targetRef: RefObject<HTMLElement | null>;
  /** The format currently being written, or null when idle. */
  busyFormat: ImageFormat | null;
  isBusy: boolean;
  /** Short status line for the UI (success note or failure reason). */
  notice: { tone: "ok" | "warn"; text: string } | null;
  download: (format: ImageFormat) => void;
}

/**
 * Captures the referenced element as a PNG/JPG download.
 *
 * `baseName` is resolved lazily (it's a callback) so the file name always uses
 * whichever student is on screen at click time.
 */
export function useImageDownload(
  baseName: () => string,
): UseImageDownloadResult {
  const targetRef = useRef<HTMLElement | null>(null);
  const [busyFormat, setBusyFormat] = useState<ImageFormat | null>(null);
  const [notice, setNotice] = useState<UseImageDownloadResult["notice"]>(null);

  const noticeTimer = useRef<number | null>(null);

  const showNotice = (next: UseImageDownloadResult["notice"]) => {
    setNotice(next);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), NOTICE_MS);
  };

  const download = (format: ImageFormat) => {
    const node = targetRef.current;
    if (!node || busyFormat) return;

    setBusyFormat(format);
    setNotice(null);

    const options: ExportOptions = { baseName: baseName(), format };

    // A frame's grace so the button can paint its busy state before the
    // (synchronous, layout-heavy) capture starts.
    requestAnimationFrame(() => {
      downloadNodeAsImage(node, options)
        .then(({ fileName, missingImages }) => {
          showNotice(
            missingImages > 0
              ? {
                  tone: "warn",
                  text: `Saved ${fileName} — ${missingImages} image${
                    missingImages > 1 ? "s" : ""
                  } couldn't be read`,
                }
              : { tone: "ok", text: `Saved ${fileName}` },
          );
        })
        .catch((error: unknown) => {
          console.error("Spotlight export failed:", error);
          showNotice({
            tone: "warn",
            text: error instanceof Error ? error.message : "Could not save the image.",
          });
        })
        .finally(() => setBusyFormat(null));
    });
  };

  return {
    targetRef,
    busyFormat,
    isBusy: busyFormat !== null,
    notice,
    download,
  };
}
