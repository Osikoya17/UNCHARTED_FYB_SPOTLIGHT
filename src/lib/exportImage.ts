import { getFontEmbedCSS, toCanvas } from "html-to-image";

/**
 * =============================================================================
 *  EXPORT IMAGE  —  turn a live DOM node into a downloadable PNG / JPG.
 * =============================================================================
 *  The capture is done on an off-screen *clone* rather than the node itself, so
 *  we can drop the on-screen height/scroll constraints (a downloaded card must
 *  show every line of the JSON column, not just the part that fits) without the
 *  page visibly flinching.
 * -----------------------------------------------------------------------------
 */

export type ImageFormat = "png" | "jpeg";

const MIME: Record<ImageFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
};

const EXTENSION: Record<ImageFormat, string> = {
  png: "png",
  jpeg: "jpg",
};

/** Width (in image pixels) we aim for, so the file stays crisp when shared. */
const TARGET_WIDTH = 1600;

/** Never scale beyond this, however narrow the card is on screen. */
const MAX_PIXEL_RATIO = 4;

/** Conservative canvas-area ceiling (mobile Safari gives up well before Chrome). */
const MAX_CANVAS_PIXELS = 16_000_000;

/** JPEG quality — high enough that the photos don't visibly smear. */
const JPEG_QUALITY = 0.95;

/** Opaque backdrop for JPEG, which has no alpha channel. */
const JPEG_BACKGROUND = "#09091b";

/** Marks descendants whose scroll/height clipping must be lifted for the export. */
export const UNCLIP_ATTRIBUTE = "data-export-unclip";

/**
 * Width the card is captured at, whatever the window is doing.
 *
 * The card lays itself out from its own width via container queries, so pinning
 * the clone to this width makes every download come out as the medium "poster"
 * layout — the same file from a phone, a laptop, or an ultrawide monitor.
 */
const EXPORT_WIDTH = 800;

/** Poster proportion the card falls back to when a student wrote very little. */
const EXPORT_MIN_ASPECT = 4 / 3;

/** Stand-in for an image we couldn't read — keeps the SVG render from failing. */
const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export interface ExportResult {
  fileName: string;
  /** Images we couldn't read (blocked by CORS, deleted, not shared publicly). */
  missingImages: number;
}

/**
 * Google Drive's `thumbnail` endpoint 302s to googleusercontent, and that
 * redirect hop carries no CORS headers — so its pixels can't be read into a
 * canvas. The final host *does* send `Access-Control-Allow-Origin: *`, so go
 * straight there when exporting. Anything else is returned as-is.
 */
function corsFriendlyUrl(src: string): string | null {
  try {
    const url = new URL(src, window.location.href);
    if (url.hostname !== "drive.google.com" || url.pathname !== "/thumbnail") {
      return null;
    }

    const id = url.searchParams.get("id");
    if (!id) return null;

    const size = url.searchParams.get("sz") || "w600";
    return `https://lh3.googleusercontent.com/d/${id}=${size}`;
  } catch {
    return null;
  }
}

async function fetchAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url, {
    mode: "cors",
    cache: "force-cache",
    // googleusercontent answers 429 to anything carrying a Referer (hotlink
    // protection), so ask the browser not to send one.
    referrerPolicy: "no-referrer",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const blob = await response.blob();

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Unreadable image"));
    reader.readAsDataURL(blob);
  });
}

/** Data URLs are reused across exports — the fonts and artwork never change. */
const dataUrlCache = new Map<string, string>();

/** Resolve one image URL to a data URL, trying the CORS-friendly host first. */
async function toDataUrl(src: string): Promise<string | null> {
  if (!src || src.startsWith("data:")) return null;

  const cached = dataUrlCache.get(src);
  if (cached) return cached;

  const candidates = [corsFriendlyUrl(src), src].filter(
    (value): value is string => Boolean(value),
  );

  for (const candidate of candidates) {
    try {
      const dataUrl = await fetchAsDataUrl(candidate);
      dataUrlCache.set(src, dataUrl);
      return dataUrl;
    } catch {
      // Try the next candidate; a total failure is reported to the caller.
    }
  }

  console.warn(`Could not inline image for export: ${src}`);
  return null;
}

/**
 * Swap every `<img>` in the clone for an inline data URL and wait for it to
 * decode. The renderer draws into an SVG `foreignObject`, which cannot reach out
 * to the network — anything left as a remote URL comes out blank, and an
 * unresolvable one fails the whole render, so misses get a transparent pixel.
 */
async function inlineImages(root: HTMLElement): Promise<number> {
  const images = Array.from(root.querySelectorAll("img"));
  let missing = 0;

  await Promise.all(
    images.map(async (image) => {
      const dataUrl = await toDataUrl(image.src);

      image.removeAttribute("srcset");
      image.src = dataUrl ?? TRANSPARENT_PIXEL;

      if (!dataUrl) {
        missing += 1;
        return;
      }

      try {
        await image.decode();
      } catch {
        image.src = TRANSPARENT_PIXEL;
        missing += 1;
      }
    }),
  );

  return missing;
}

/** Embedded @font-face CSS is expensive to build, so do it once per session. */
let fontEmbedCSS: Promise<string> | null = null;

function embeddedFonts(node: HTMLElement): Promise<string> {
  fontEmbedCSS ??= getFontEmbedCSS(node, { preferredFontFormat: "woff2" }).catch(
    (error: unknown) => {
      // Losing the custom fonts is worth an export; losing the export isn't.
      console.warn("Could not embed fonts for export:", error);
      fontEmbedCSS = null;
      return "";
    },
  );

  return fontEmbedCSS;
}

/**
 * Stage a clone off-screen at the fixed export width, with the height and scroll
 * limits lifted so the full card lays out.
 *
 * A clone rather than the live node so the page doesn't visibly resize, and at a
 * fixed width rather than the on-screen width so the download is the same shape
 * from any device.
 */
function stageClone(node: HTMLElement): { clone: HTMLElement; remove: () => void } {
  const stage = document.createElement("div");
  stage.setAttribute("aria-hidden", "true");
  stage.style.cssText = `position:fixed;top:0;left:0;width:${EXPORT_WIDTH}px;opacity:0;pointer-events:none;z-index:-1;`;

  const clone = node.cloneNode(true) as HTMLElement;
  clone.style.margin = "0";
  clone.style.width = `${EXPORT_WIDTH}px`;
  clone.style.maxWidth = "none";
  // Let the card grow to fit its content, but never shrink below the poster
  // proportions. (The card's own min-height is in container-query units, which
  // resolve against a wrapper that isn't cloned — so restate it in pixels.)
  clone.style.aspectRatio = "auto";
  clone.style.height = "auto";
  clone.style.minHeight = `${Math.round(EXPORT_WIDTH * EXPORT_MIN_ASPECT)}px`;

  clone
    .querySelectorAll<HTMLElement>(`[${UNCLIP_ATTRIBUTE}]`)
    .forEach((element) => {
      element.style.overflow = "visible";
      element.style.maxHeight = "none";
    });

  stage.appendChild(clone);
  document.body.appendChild(stage);

  return { clone, remove: () => stage.remove() };
}

/** Scale the capture up for sharpness, staying inside the canvas area ceiling. */
function pixelRatioFor(width: number, height: number): number {
  if (width <= 0 || height <= 0) return 1;

  const forSharpness = Math.max(2, TARGET_WIDTH / width);
  const forCanvasLimit = Math.sqrt(MAX_CANVAS_PIXELS / (width * height));

  return Math.max(1, Math.min(MAX_PIXEL_RATIO, forSharpness, forCanvasLimit));
}

function canvasToBlob(canvas: HTMLCanvasElement, format: ImageFormat): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("The browser couldn't encode the image.")),
      MIME[format],
      format === "jpeg" ? JPEG_QUALITY : undefined,
    );
  });
}

function saveBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Give the download a moment to latch on before releasing the blob.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export interface ExportOptions {
  /** File name without extension, e.g. `fyb-spotlight-taofeek`. */
  baseName: string;
  format: ImageFormat;
}

/** Render `node` to an image file and hand it to the browser's downloader. */
export async function downloadNodeAsImage(
  node: HTMLElement,
  { baseName, format }: ExportOptions,
): Promise<ExportResult> {
  const { clone, remove } = stageClone(node);

  try {
    const [missingImages, fonts] = await Promise.all([
      inlineImages(clone),
      embeddedFonts(node),
    ]);

    const canvas = await toCanvas(clone, {
      pixelRatio: pixelRatioFor(clone.offsetWidth, clone.offsetHeight),
      backgroundColor: format === "jpeg" ? JPEG_BACKGROUND : undefined,
      fontEmbedCSS: fonts,
      preferredFontFormat: "woff2",
      imagePlaceholder: TRANSPARENT_PIXEL,
    });

    const fileName = `${baseName}.${EXTENSION[format]}`;
    saveBlob(await canvasToBlob(canvas, format), fileName);

    return { fileName, missingImages };
  } finally {
    remove();
  }
}
