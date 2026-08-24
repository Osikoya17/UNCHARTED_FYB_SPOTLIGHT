/**
 * =============================================================================
 *  SOCIAL HANDLE  —  making one free-form answer fit a fixed-width card.
 * =============================================================================
 *  The sheet's social column holds whatever students typed: "@ogmatmike", a
 *  150-character LinkedIn URL with tracking parameters, or three platforms
 *  listed in one cell. The card has room for about twenty characters, so this
 *  module picks the first handle and strips everything that carries no
 *  information. The original text is kept for the tooltip and the link.
 * -----------------------------------------------------------------------------
 */

export type Platform = "instagram" | "x" | "linkedin" | "facebook" | "link";

/** Best-effort guess of the platform from free-form handle text. */
export function detectPlatform(text: string): Platform {
  const t = text.toLowerCase();
  if (t.includes("linkedin")) return "linkedin";
  if (t.includes("facebook") || t.includes("fb.com")) return "facebook";
  // "IG", "Ins", "Insta" are all used as labels for the same platform.
  if (t.includes("instagram") || t.includes("insta") || /(^|[^a-z])(?:ig|ins)\b/i.test(text))
    return "instagram";
  if (t.includes("x.com") || t.includes("twitter") || /(^|[^a-z])x[\s:-]/i.test(text))
    return "x";
  return "link";
}

/** Pull the first URL out of the text (adding https:// to bare domains). */
export function extractUrl(text: string): string | undefined {
  const full = text.match(/https?:\/\/[^\s,]+/i);
  if (full) return full[0];
  const bare = text.match(/\b[\w-]+\.(?:com|org|net|io|dev|me|ng)\/[^\s,]*/i);
  if (bare) return `https://${bare[0]}`;
  return undefined;
}

/**
 * Longest handle we print. Past this the card's left column starts competing
 * with the JSON column for width, so the rest is traded for an ellipsis.
 */
const MAX_CHARS = 22;

/** "IG:", "LinkedIn -", "X(twitter):" … the label people type before a handle. */
const PLATFORM_LABEL =
  "(?:ig|ins(?:ta(?:gram)?)?|x|twitter|linked ?in|lin|fb|facebook|snap(?:chat)?|tiktok|threads|other socials?)\\b[^\\s:\\-–—]*\\s*[:\\-–—]\\s*";

/** Strips a leading "IG:" style label. */
const LEADING_LABEL = new RegExp(`^\\s*${PLATFORM_LABEL}`, "i");

/** Where a second handle starts — many students list three in one cell. */
const NEXT_HANDLE = new RegExp(`[,|]|\\s+l\\s+|\\s+${PLATFORM_LABEL}`, "i");

/** Trailing separators left behind after cutting. */
const TRAILING_PUNCTUATION = /[,.;:|&\s]+$/;

/**
 * The first "Platform: handle" entry of a cell that may list several, label
 * included. Used so the icon describes the handle we actually print — a cell
 * reading "Instagram: ada, LinkedIn: Ada Obi" shows the Instagram mark, not
 * whichever platform happens to be mentioned last.
 */
function firstEntry(text: string): string {
  // A URL identifies its own platform through the host, so keep it intact.
  if (extractUrl(text)) return text;

  const body = text.replace(LEADING_LABEL, "");
  const label = text.slice(0, text.length - body.length);
  return label + body.split(NEXT_HANDLE)[0];
}

/** Icon to show for a free-form answer, based on its first entry only. */
export function platformFor(text: string): Platform {
  return detectPlatform(firstEntry(text));
}

/** Squeeze a free-form answer down to one short handle. */
export function shortenHandle(text: string): string {
  const url = extractUrl(text);
  let short: string;

  if (url) {
    // Keep the part that identifies the person: the last path segment
    // ("/in/ada-obi-123?utm_source=share" -> "ada-obi-123"), or the host.
    const withoutQuery = url.split(/[?#]/)[0].replace(/\/+$/, "");
    const segments = withoutQuery.split("/").slice(3).filter(Boolean);
    short =
      segments.at(-1) ??
      withoutQuery.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  } else {
    short = text.replace(LEADING_LABEL, "").split(NEXT_HANDLE)[0];
  }

  short = short.replace(/\s+/g, " ").trim().replace(TRAILING_PUNCTUATION, "");

  return short.length > MAX_CHARS ? `${short.slice(0, MAX_CHARS - 1)}…` : short;
}
