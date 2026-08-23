import type { ComponentType } from "react";
import { FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

type SocialPlatform = "instagram" | "x" | "linkedin";

const ICONS: Record<SocialPlatform, ComponentType<{ className?: string }>> = {
  instagram: FaInstagram,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
};

interface SocialIconProps {
  platform: SocialPlatform;
}

const SocialIcon = ({ platform }: SocialIconProps) => {
  const Icon = ICONS[platform];

  return (
    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#17172a] text-white">
      <Icon className="text-sm" />
    </span>
  );
};

export default SocialIcon;
