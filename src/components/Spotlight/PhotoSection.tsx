import { useState } from "react";

import Throwback from "./Throwback";

interface PhotoSectionProps {
  photo?: string;
  throwbackPhoto?: string;
}

const PhotoSection = ({
  photo,
  throwbackPhoto,
}: PhotoSectionProps) => {
  return (
    <div className="relative h-125 overflow-hidden rounded-md border border-white/50 bg-[#eeeeef] @min-[560px]:h-170 @min-[760px]:h-140 @min-[900px]:h-auto @min-[900px]:aspect-3/4">

      {photo ? (
        /* Keyed by src so switching students remounts a fresh loader. */
        <ProfilePhoto key={photo} src={photo} />
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-center font-sans text-[#76768a]">
          
          <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-dashed border-[#777b91] text-6xl">
            ♙
          </div>

          <strong>PHOTO</strong>
          <strong>PLACEHOLDER</strong>

        </div>
      )}

      <Throwback image={throwbackPhoto} />

    </div>
  );
};

/** Fades the photo in over a shimmering skeleton once it has loaded. */
const ProfilePhoto = ({ src }: { src: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-full w-full">
      {/* Shimmering stand-in shown until the Google Drive image lands. */}
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#e6e7ec] to-[#c9cad4]"
        />
      )}

      <img
        src={src}
        alt="Profile"
        /* googleusercontent answers 429 to anything carrying a Referer. */
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default PhotoSection;