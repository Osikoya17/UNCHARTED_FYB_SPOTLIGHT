import type { Profile } from "../../types/profiles";
import SocialLink from "../ui/SocialIcons";

interface ProfileInfoProps {
  profile: Profile;
}

const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  return (
    <>
      <div className="mt-2 mb-2 relative px-4 pb-5 bg-[rgb(220,220,220,0.1)] rounded-md pt-6">

        <h2 className="font-apfel text-3xl font-bold font-black leading-[1.05] tracking-[-2px] text-[#f4f348] break-words sm:text-[2rem]">
          {profile.fullName.toUpperCase() || "TAOFEEK"}
        </h2>

        {profile.nickname && (
          <p className="mt-2 font-mono text-sm tracking-wider text-gray-300">
            “{profile.nickname}”
          </p>
        )}

        {/* <span className="absolute bottom-5 right-4 text-[10px] text-gray-300">
          137
        </span> */}

      </div>


      {/* PERSONAL INFORMATION */}

      <div className="overflow-hidden rounded-md bg-[#eeeeef] text-[#20202e]">

        {/* Birthday */}

        <div className="flex min-h-[52px] items-center border-b border-gray-400 px-4">

          <span className="w-24 shrink-0 text-[10px] tracking-wider text-[#808080] font-bold font-mono">
            BIRTHDAY
          </span>

          <span className="font-mono text-sm font-bold">
            {profile.birthday || "—"}
          </span>

        </div>


        {/* Social media */}

        <div className="flex min-h-[58px] items-center px-4">

          <span className="w-24 shrink-0 text-[10px] tracking-wider text-[#808080] font-bold font-mono">
            SOCIAL
          </span>

          <div className="flex min-w-0 flex-1">
            <SocialLink value={profile.social} />
          </div>

        </div>

      </div>
    </>
  );
};

export default ProfileInfo;
