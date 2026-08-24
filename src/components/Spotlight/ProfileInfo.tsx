// import { FaUserTag, FaCakeCandles, FaShareNodes } from "react-icons/fa6";
import type { Profile } from "../../types/profiles";
import SocialIcon from "../ui/SocialIcons";

interface ProfileInfoProps {
  profile: Profile;
}

const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  return (
    <>
      <div className="mt-2 mb-2 relative px-4 pb-5 bg-[rgb(220,220,220,0.1)] rounded-md pt-6">

        {/* First name headlines the card, surname sits under it. Two rows in the
            sheet have no surname, so the subtitle is dropped rather than blank. */}
        <h2 className="font-apfel text-4xl font-black leading-none font-bold text-[#f4f348] sm:text-3xl">
          {profile.firstname.toUpperCase() || "FIRST NAME"}
        </h2>

        {profile.lastname && (
          <p className="mt-2 font-mono text-sm tracking-wider text-gray-300 sm:text-lg">
            {profile.lastname.toUpperCase()}
          </p>
        )}

        <span className="absolute bottom-5 right-4 text-[10px] text-gray-300">
          137
        </span>

      </div>


      {/* PERSONAL INFORMATION */}

      <div className="overflow-hidden rounded-md bg-[#eeeeef] text-[#20202e]">

        {/* Nickname */}

        <div className="flex min-h-[52px] items-center border-b border-gray-400 px-4">

          {/* <span className="flex w-7 items-center text-lg">
            <FaUserTag />
          </span> */}

          <span className="w-32 text-[10px] tracking-wider text-[#808080] font-bold font-mono">
            NICKNAME
          </span>

          <span className="font-mono text-sm font-bold">
            {profile.nickname || "—"}
          </span>

        </div>


        {/* Birthday */}

        <div className="flex min-h-[52px] items-center border-b border-gray-400 px-4">

          {/* <span className="flex w-7 items-center text-lg">
            <FaCakeCandles />
          </span> */}

          <span className="w-32 text-[10px] tracking-wider text-[#808080] font-bold font-mono">
            BIRTHDAY
          </span>

          <span className="font-mono text-sm font-bold">
            {profile.birthday || "—"}
          </span>

        </div>


        {/* Social media */}

        <div className="flex min-h-[58px] items-center px-4">

          {/* <span className="flex w-7 items-center text-lg">
            <FaShareNodes />
          </span> */}

          <span className="w-32 text-[10px] tracking-wider text-[#808080] font-bold font-mono">
            SOCIAL MEDIA
          </span>

          <div className="flex min-w-0 flex-1">

            {/* One icon + the handle, picked from what the student actually typed. */}
            <SocialIcon value={profile.social} />

          </div>

        </div>

      </div>
    </>
  );
};
     
export default ProfileInfo;