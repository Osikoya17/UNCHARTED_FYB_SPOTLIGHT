import Papa from "papaparse";

import type { Profile } from "../types/profiles";
import { profile as sampleProfile } from "../data/profiles";

/**
 * =============================================================================
 *  COLUMN MAP  —  the ONLY place to edit when your sheet headers change.
 * =============================================================================
 *  Left side  = a field on the `Profile` type   (do NOT rename these).
 *  Right side = the EXACT column header text in the Google Sheet (must match the
 *               header cell exactly, including spaces / punctuation / casing).
 *
 *  One row in the sheet = one student = one Profile.
 *  These map to the CSC UNCHARTED Google Form responses.
 * -----------------------------------------------------------------------------
 */
export const COLUMN_MAP = {
  // "Goody" is the manually-maintained full-name column (populated for every row).
  fullName: "Goody",
  nickname: "Nickname",
  birthday: "Your Birthday",

  photo: "Upload a Recent Picture",
  throwbackPhoto: "Upload a Throwback Picture (Optional)",

  social: "Your Primary Social Media Handle (e.g., Instagram/X/LinkedIn)",

  funFact: "One Fun Fact About You",
  favCourse: "Favourite Course",
  leastFavCourse: "Least Favourite Course",
  favLecturer: "Favourite Lecturer (Department or Name)",
  favYoutubeTutor: "Favourite YouTube Tutor/Channel for Academics",

  whatDoYouDo: "What do you do? (Hobbies, side hustle, skills, etc.)",
  bestExpOnCampus: "Best Moment on Campus",
  worstExpOnCampus: "Worst Experience on Campus",
  ifNotCSC: "If not CSC, then what?",

  unexpectedExp: "One thing you never thought you'd experience as a student",
  hotTake:
    "What is that one 'hot take' you have that will make other people come for you?",
  journeyInOneWord: "Describe your undergraduate journey in one word",
  overallOauExperience: "Rate your overall OAU experience so far",

  favQuote: "Favourite Quote",
  shoutout: "Special Shoutout (Who would you like to appreciate?)",
} as const;

/** A parsed CSV row keyed by header text. Short rows can yield undefined cells. */
type CsvRow = Record<string, string | undefined>;

const clean = (value: string | undefined): string => (value ?? "").trim();

/** Pull a Google Drive file id out of the various link shapes people paste. */
function driveFileId(url: string): string | null {
  const match =
    url.match(/[?&]id=([\w-]+)/) ||
    url.match(/\/file\/d\/([\w-]+)/) ||
    url.match(/\/d\/([\w-]+)/);
  return match ? match[1] : null;
}

/**
 * Google Form file-upload answers are `drive.google.com/open?id=...` links, which
 * do NOT render in an <img>. Convert them to the thumbnail endpoint (which serves
 * the actual image, CORS-friendly). Non-Drive URLs are returned untouched.
 */
function toImageUrl(value: string, size = 1000): string {
  const raw = clean(value);
  if (!raw) return "";
  if (!/drive\.google|docs\.google/i.test(raw)) return raw;
  const id = driveFileId(raw);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${size}` : raw;
}

/** Values people type to mean "I have no socials" — treat as empty. */
function cleanSocial(value: string): string {
  const raw = clean(value);
  return /^(nil|none|n\/?a|na|nan|-|—|\.)$/i.test(raw) ? "" : raw;
}

/** Turn one CSV row into a typed Profile using COLUMN_MAP. */
function rowToProfile(row: CsvRow): Profile {
  const get = (header: string): string => clean(row[header]);

  return {
    fullName: get(COLUMN_MAP.fullName),
    nickname: get(COLUMN_MAP.nickname),
    birthday: get(COLUMN_MAP.birthday),

    photo: toImageUrl(row[COLUMN_MAP.photo] ?? ""),
    throwbackPhoto: toImageUrl(row[COLUMN_MAP.throwbackPhoto] ?? ""),

    social: cleanSocial(row[COLUMN_MAP.social] ?? ""),

    funFact: get(COLUMN_MAP.funFact),
    favCourse: get(COLUMN_MAP.favCourse),
    leastFavCourse: get(COLUMN_MAP.leastFavCourse),
    favLecturer: get(COLUMN_MAP.favLecturer),
    favYoutubeTutor: get(COLUMN_MAP.favYoutubeTutor),

    whatDoYouDo: get(COLUMN_MAP.whatDoYouDo),
    bestExpOnCampus: get(COLUMN_MAP.bestExpOnCampus),
    worstExpOnCampus: get(COLUMN_MAP.worstExpOnCampus),
    ifNotCSC: get(COLUMN_MAP.ifNotCSC),

    unexpectedExp: get(COLUMN_MAP.unexpectedExp),
    hotTake: get(COLUMN_MAP.hotTake),
    journeyInOneWord: get(COLUMN_MAP.journeyInOneWord),
    overallOauExperience: get(COLUMN_MAP.overallOauExperience),

    favQuote: get(COLUMN_MAP.favQuote),
    shoutout: get(COLUMN_MAP.shoutout),
  };
}

/** A row is considered blank if it has no name at all — skip these. */
function hasIdentity(profile: Profile): boolean {
  return Boolean(profile.fullName || profile.nickname);
}

/**
 * Fetch the published Google Sheet CSV and return one Profile per row.
 * If no sheet URL is configured, falls back to the local sample profile so the
 * app still renders during development.
 */
export async function loadProfiles(): Promise<Profile[]> {
  const url = import.meta.env.VITE_SHEET_CSV_URL;

  // Not configured yet -> keep showing the local placeholder profile.
  if (!url) return [sampleProfile];

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load the sheet (HTTP ${response.status}).`);
  }

  const csv = await response.text();
  const parsed = Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    // PapaParse recovers from most row-level issues; surface them without failing.
    console.warn("CSV parse warnings:", parsed.errors);
  }

  return parsed.data.map(rowToProfile).filter(hasIdentity);
}

/** URL-safe slug built from a profile's name, used for `?student=` selection. */
export function profileSlug(profile: Profile): string {
  const base = (profile.fullName || profile.nickname || "student")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "student";
}

export interface ProfileEntry {
  slug: string;
  profile: Profile;
}

/** Pair each profile with a unique slug (dedupes name collisions). */
export function withSlugs(profiles: Profile[]): ProfileEntry[] {
  const counts = new Map<string, number>();

  return profiles.map((profile) => {
    const base = profileSlug(profile);
    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    return { slug: seen === 0 ? base : `${base}-${seen + 1}`, profile };
  });
}
