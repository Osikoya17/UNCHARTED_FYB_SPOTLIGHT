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
    <div className="relative h-[500px] overflow-hidden rounded-md border border-white/50 bg-[#eeeeef] sm:h-[680px]">

      {photo ? (
        <img
          src={photo}
          alt="Profile"
          className="h-full w-full object-cover"
        />
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

export default PhotoSection;