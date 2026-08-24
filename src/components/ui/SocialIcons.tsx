import type { ComponentType } from "react";
import {
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaLink,
} from "react-icons/fa6";

import {
  extractUrl,
  platformFor,
  shortenHandle,
  type Platform,
} from "../../lib/socialHandle";

const ICONS: Record<Platform, ComponentType<{ className?: string }>> = {
  instagram: FaInstagram,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
  facebook: FaFacebookF,
  link: FaLink,
};

interface SocialLinkProps {
  value: string;
}

/**
 * Renders one social handle from the sheet: an icon + a shortened handle, linked
 * when the text contains a URL, with the student's full answer as the tooltip.
 * Falls back to a dash when they left it blank.
 */
const SocialLink = ({ value }: SocialLinkProps) => {
  const text = (value ?? "").trim();

  if (!text) {
    return <span className="font-mono text-sm text-[#9a9aa6]">—</span>;
  }

  const Icon = ICONS[platformFor(text)];
  const href = extractUrl(text);

  const chip = (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#17172a] text-white">
      <Icon className="text-sm" />
    </span>
  );

  /*
    break-all + line-clamp-2 is what keeps every card the same shape: it drops
    the handle's min-content width to a single character, so a long one wraps
    onto a second line instead of widening the whole left column.
  */
  const handle = (
    <span className="line-clamp-2 min-w-0 break-all font-mono text-sm font-bold">
      {shortenHandle(text)}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        title={text}
        className="flex min-w-0 items-center gap-2 text-[#20202e] underline-offset-2 transition hover:text-[#3b5bdb] hover:underline"
      >
        {chip}
        {handle}
      </a>
    );
  }

  return (
    <span title={text} className="flex min-w-0 items-center gap-2 text-[#20202e]">
      {chip}
      {handle}
    </span>
  );
};

export default SocialLink;
