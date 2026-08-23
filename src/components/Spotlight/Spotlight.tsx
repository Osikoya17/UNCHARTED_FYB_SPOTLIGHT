import { useState, type ReactNode } from "react";

import type { Profile } from "../../types/profiles";

import TopMeta from "./TopMeta";
import Header from "./Header";
import PhotoSection from "./PhotoSection";
import ProfileInfo from "./ProfileInfo";
import JsonSection from "./JsonSection";
import Footer from "./Footer";

const BACKGROUNDS = {
  blue: "/Blue BG.png",
  green: "/Green BG.png",
} as const;

// Fallback colour shown behind the image (matches each artwork's base tone)
const FALLBACK_COLOR = {
  blue: "#111127",
  green: "#0a2a28",
} as const;

// Swatch colour for the theme switcher buttons
const SWATCH_COLOR = {
  blue: "#3b5bdb",
  green: "#0f9d8f",
} as const;

type BgColor = keyof typeof BACKGROUNDS;

interface SpotlightProps {
  profile: Profile;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  selector?: ReactNode;
}

const Spotlight = ({ profile, onRefresh, isRefreshing, selector }: SpotlightProps) => {

  const [bgColor, setBgColor] = useState<BgColor>("blue");

  const sections = [
    {
      startNumber: 2,
      lines: [
        {
          key: "fun_fact",
          value: profile.funFact,
        },
      ],
    },

    {
      startNumber: 3,
      lines: [
        {
          key: "fav_course",
          value: profile.favCourse,
        },
        {
          key: "least_fav_course",
          value: profile.leastFavCourse,
        },
        {
          key: "fav_lecturer",
          value: profile.favLecturer,
        },
        {
          key: "fav_youtube_tutor",
          value: profile.favYoutubeTutor,
        },
      ],
    },

    {
      startNumber: 7,
      lines: [
        {
          key: "what_do_you_do",
          value: profile.whatDoYouDo,
        },
        {
          key: "best_exp_on_campus",
          value: profile.bestExpOnCampus,
        },
        {
          key: "worst_exp_on_campus",
          value: profile.worstExpOnCampus,
        },
        {
          key: "if_not_csc",
          value: profile.ifNotCSC,
        },
      ],
    },

    {
      startNumber: 11,
      lines: [
        {
          key: "unexpected_exp",
          value: profile.unexpectedExp,
        },
        {
          key: "hot_take",
          value: profile.hotTake,
        },
        {
          key: "journey_in_one_word",
          value: profile.journeyInOneWord,
        },
        {
          key: "overall_oau_experience",
          value: profile.overallOauExperience,
        },
      ],
    },

    {
      startNumber: 15,
      lines: [
        {
          key: "fav_quote",
          value: profile.favQuote,
        },
        {
          key: "shoutout",
          value: profile.shoutout,
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#09091b] p-2 sm:p-7">

      {/* Background switcher */}

      <div className="mx-auto mb-3 flex w-full items-center justify-between gap-2 md:max-w-[800px]">

        {/* Student selector (left) — empty spacer keeps Theme right-aligned when absent */}
        <div className="min-w-0 flex-1">
          {selector}
        </div>

        <div className="flex items-center gap-2">

          <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
            Theme
          </span>

          {(Object.keys(BACKGROUNDS) as BgColor[]).map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setBgColor(color)}
              aria-label={`${color} background`}
              aria-pressed={bgColor === color}
              title={`${color} background`}
              style={{ backgroundColor: SWATCH_COLOR[color] }}
              className={`h-5 w-5 rounded-full ring-2 ring-offset-2 ring-offset-[#09091b] transition ${
                bgColor === color
                  ? "ring-white"
                  : "ring-transparent hover:ring-white/40"
              }`}
            />
          ))}

        </div>

      </div>

      <section
        style={{
          backgroundImage: `url('${BACKGROUNDS[bgColor]}')`,
          backgroundColor: FALLBACK_COLOR[bgColor],
        }}
        className="
    relative mx-auto w-full md:max-w-[800px] overflow-hidden
    border border-white/20
    bg-cover bg-center bg-no-repeat
    text-white transition-colors
    md:flex md:aspect-[3/4] md:flex-col
        "
      >
        <TopMeta />

        <Header onFetch={onRefresh} isFetching={isRefreshing} />

        <div className="grid grid-cols-1 gap-4 px-5 pb-8 sm:grid-cols-[1fr_1.08fr] sm:px-9 md:min-h-0 md:flex-1 md:overflow-y-auto">

          <div>

            <PhotoSection
              photo={profile.photo}
              throwbackPhoto={profile.throwbackPhoto}
            />

            <ProfileInfo profile={profile} />

          </div>


          {/* RIGHT */}

          <div className="flex flex-col gap-2.5">

            {/* Opening brace */}

            <div className="rounded-md bg-[#eeeeef] p-4 text-[#20202e]">

              <div className="font-mono text-[10px] sm:text-[13px]">
                <span className="mr-5 text-[#999aaa]">
                  1
                </span>

                {"{"}
              </div>

              <JsonSection
                lines={sections[0].lines}
                startNumber={sections[0].startNumber}
              />

            </div>


            {/* Remaining sections */}

            {sections.slice(1).map((section) => (
              <JsonSection
                key={section.startNumber}
                lines={section.lines}
                startNumber={section.startNumber}
              />
            ))}


            {/* Closing brace */}

            <div className="rounded-md bg-[#eeeeef] p-4 text-[#20202e]">

              <div className="font-mono text-[10px] sm:text-[13px]">

                <span className="mr-5 text-[#999aaa]">
                  17
                </span>

                {"}"}

              </div>

            </div>

          </div>

        </div>


        {/* Side username */}

        <div className="absolute bottom-36 right-2 hidden [writing-mode:vertical-rl] text-[10px] tracking-wider text-gray-300 sm:block">
          ◎ CSC_UNCHARTED
        </div>


        {/* Footer */}

        <Footer />

      </section>

    </main>
  );
};

export default Spotlight;