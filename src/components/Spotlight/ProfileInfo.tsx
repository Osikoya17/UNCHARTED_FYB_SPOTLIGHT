// import { FaUserTag, FaCakeCandles, FaShareNodes } from "react-icons/fa6";
import type { Profile } from "../../types/profiles";
import SocialIcon from "../ui/SocialIcons";

interface ProfileInfoProps {
  profile: Profile;
  /** 1-based position in the class list — matches the number shown in the dropdown. */
  studentNumber: number;
}

const ProfileInfo = ({ profile, studentNumber }: ProfileInfoProps) => {
  return (
    <>
      <div className="mt-2 mb-2 relative px-4 pb-5 bg-[rgb(220,220,220,0.1)] rounded-md pt-6">

        {/* First name headlines the card, surname sits under it. Two rows in the
            sheet have no surname, so the subtitle is dropped rather than blank. */}
        <h2 className="font-apfel text-4xl leading-none font-bold text-[#f4f348] @min-[560px]:text-3xl">
          {profile.firstname.toUpperCase() || "FIRST NAME"}
        </h2>

        {profile.lastname && (
          <p className="mt-2 font-mono text-sm tracking-wider text-gray-300 @min-[560px]:text-lg">
            {profile.lastname.toUpperCase()}
          </p>
        )}

        <span className="absolute bottom-5 right-4 text-[10px] text-gray-300">
          {String(studentNumber).padStart(2, "0")}
        </span>

      </div>


      {/* PERSONAL INFORMATION
          Stacked rows on narrow/poster cards; on the wide template they wrap
          into a 2-column grid (nickname | birthday, social spanning both) so
          the left column stays short and the whole card fits the screen. */}

      <div className="overflow-hidden rounded-md bg-[#eeeeef] text-[#20202e] @min-[900px]:grid @min-[900px]:grid-cols-2">

        {/* Nickname */}

        <div className="flex min-h-13 items-center border-b border-gray-400 px-4 @min-[900px]:flex-col @min-[900px]:items-start @min-[900px]:justify-center @min-[900px]:gap-1 @min-[900px]:py-3 @min-[900px]:border-r">

          {/* <span className="flex w-7 items-center text-lg">
            <FaUserTag />
          </span> */}

          <span className="w-32 text-[10px] tracking-wider text-[#808080] font-bold font-mono @min-[900px]:w-auto">
            NICKNAME
          </span>

          <span className="font-mono text-sm font-bold">
            {profile.nickname || "—"}
          </span>

        </div>


        {/* Birthday */}

        <div className="flex min-h-13 items-center border-b border-gray-400 px-4 @min-[900px]:flex-col @min-[900px]:items-start @min-[900px]:justify-center @min-[900px]:gap-1 @min-[900px]:py-3">

          {/* <span className="flex w-7 items-center text-lg">
            <FaCakeCandles />
          </span> */}

          <span className="w-32 text-[10px] tracking-wider text-[#808080] font-bold font-mono @min-[900px]:w-auto">
            BIRTHDAY
          </span>

          <span className="font-mono text-sm font-bold">
            {profile.birthday || "—"}
          </span>

        </div>


        {/* Social media */}

        <div className="flex min-h-14.5 items-center px-4 @min-[900px]:col-span-2">

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