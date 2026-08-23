import type { ComponentType } from "react";
import {
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaLink,
} from "react-icons/fa6";

type Platform = "instagram" | "x" | "linkedin" | "facebook" | "link";

const ICONS: Record<Platform, ComponentType<{ className?: string }>> = {
  instagram: FaInstagram,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
  facebook: FaFacebookF,
  link: FaLink,
};

/** Best-effort guess of the platform from free-form handle text. */
function detectPlatform(text: string): Platform {
  const t = text.toLowerCase();
  if (t.includes("linkedin")) return "linkedin";
  if (t.includes("facebook") || t.includes("fb.com")) return "facebook";
  if (t.includes("instagram") || t.includes("insta") || /\big\b/i.test(text))
    return "instagram";
  if (t.includes("x.com") || t.includes("twitter") || /(^|[^a-z])x[\s:-]/i.test(text))
    return "x";
  return "link";
}

/** Pull the first URL out of the text (adding https:// to bare domains). */
function extractUrl(text: string): string | undefined {
  const full = text.match(/https?:\/\/[^\s,]+/i);
  if (full) return full[0];
  const bare = text.match(/\b[\w-]+\.(?:com|org|net|io|dev|me|ng)\/[^\s,]*/i);
  if (bare) return `https://${bare[0]}`;
  return undefined;
}

interface SocialLinkProps {
  value: string;
}

/**
 * Renders one social handle from the sheet: an icon + the text, linked when the
 * text contains a URL. Falls back to a dash when the student left it blank.
 */
const SocialLink = ({ value }: SocialLinkProps) => {
  const text = (value ?? "").trim();

  if (!text) {
    return <span className="font-mono text-sm text-[#9a9aa6]">—</span>;
  }

  const Icon = ICONS[detectPlatform(text)];
  const href = extractUrl(text);

  const chip = (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#17172a] text-white">
      <Icon className="text-sm" />
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex min-w-0 items-center gap-2 text-[#20202e] transition hover:text-[#3b5bdb]"
      >
        {chip}
        <span className="truncate font-mono text-sm font-bold underline-offset-2 hover:underline">
          {text}
        </span>
      </a>
    );
  }

  return (
    <span className="flex min-w-0 items-center gap-2 text-[#20202e]">
      {chip}
      <span className="truncate font-mono text-sm font-bold">{text}</span>
    </span>
  );
};

export default SocialLink;
