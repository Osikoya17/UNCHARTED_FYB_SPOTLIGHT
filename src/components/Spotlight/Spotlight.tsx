import { useEffect, useState, type ReactNode } from "react";

import type { Profile } from "../../types/profiles";
import { UNCLIP_ATTRIBUTE } from "../../lib/exportImage";
import { profileSlug, writeupLength } from "../../lib/loadProfiles";
import { useImageDownload } from "../../hooks/useImageDownload";
import { useFitToScreen } from "../../hooks/useFitToScreen";
import { useSwipeNavigation } from "../../hooks/useSwipeNavigation";
import DownloadButton from "../ui/DownloadButton";

import TopMeta from "./TopMeta";
import Header from "./Header";
import PhotoSection from "./PhotoSection";
import ProfileInfo from "./ProfileInfo";
import JsonSection from "./JsonSection";
import Footer from "./Footer";
import { FaInstagram } from "react-icons/fa6";

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
  /** 1-based position of this student in the class list (shown on the card). */
  studentNumber: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  /** Step to the previous / next student. Wired to the card's swipe gesture on
      touch screens (and undefined when there's only one student). */
  onPrev?: () => void;
  onNext?: () => void;
  selector?: ReactNode;
}

/**
 * =============================================================================
 *  THE CARD IS SIZED BY ITS OWN WIDTH, NOT THE WINDOW'S.
 * =============================================================================
 *  Everything inside <section> uses container queries (@min-[…]) rather than
 *  viewport breakpoints. That is what lets the download render the medium
 *  "poster" layout on any screen: the export clones the card at a fixed width,
 *  and the layout follows that width. Viewport breakpoints would follow the
 *  window instead, so a download taken on a wide monitor would come out wide.
 *
 *  Three bands, keyed off the card's own width:
 *    below 560px  — one stacked column (phones)
 *    560–899px    — the poster: photo left, JSON right, 3:4-ish  <- exported
 *    900px and up — the wide template: meta inline in the header, JSON in two
 *                   balanced columns, 16:9-ish
 *
 *  No band scrolls internally. Each has a minimum height that keeps the poster
 *  proportions when a student answered very little, and grows past it when they
 *  wrote a lot.
 * -----------------------------------------------------------------------------
 */
const Spotlight = ({ profile, studentNumber, onRefresh, isRefreshing, onPrev, onNext, selector }: SpotlightProps) => {

  const [bgColor, setBgColor] = useState<BgColor>("blue");

  // Reflect the selected theme on the document root so the palette variables in
  // index.css (page background, <body>, toolbar surfaces) switch with it. The
  // card carries its own per-theme artwork; this themes everything around it.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", bgColor);
  }, [bgColor]);

  // The card itself is the capture target; the toolbar above it is not.
  const { targetRef, busyFormat, notice, download } = useImageDownload(
    () => `fyb-spotlight-${profileSlug(profile)}-${bgColor}`,
  );

  // Scale the whole card down on medium+ screens when a long profile would
  // otherwise push the page into a scroll. innerRef is scaled; outerRef holds
  // the resulting height. The exported node (targetRef) sits inside innerRef, so
  // the download — cloned into a detached stage — never carries the transform.
  const { outerRef, innerRef } = useFitToScreen();

  // Touch screens navigate by dragging the card sideways — the prev/next arrows
  // are hidden on phones, so this is how you move between students there.
  const swipe = useSwipeNavigation({ onPrev, onNext });

  // Most cards are bounded to a comfortable reading width on large screens.
  // A student who wrote a lot needs the extra room, so their card is allowed to
  // stretch full-width — the JSON's two columns get wider instead of taller.
  // (On-screen only: the download is always captured at its own fixed width.)
  const isLongWriteup = writeupLength(profile) >= 1500;
  const cardWidthClass = isLongWriteup ? "lg:max-w-none" : "lg:max-w-[1100px]";

  // How the JSON blob splits into two columns. A heavy write-up flows into two
  // columns as soon as the poster width is reached (760px) instead of waiting for
  // the 900px wide template — this is what stops a long profile from exporting as
  // a mile-tall single column, since the 800px download lands in the poster band
  // and would otherwise render one stacked column. Both branches are full literal
  // strings so Tailwind's scanner picks up every class.
  const jsonColumnClass = isLongWriteup
    ? "flex flex-col gap-2.5 @min-[760px]:block @min-[760px]:columns-2 @min-[760px]:gap-x-6 @min-[760px]:*:mb-2.5 @min-[760px]:*:break-inside-avoid"
    : "flex flex-col gap-2.5 @min-[900px]:block @min-[900px]:columns-2 @min-[900px]:gap-x-6 @min-[900px]:*:mb-2.5 @min-[900px]:*:break-inside-avoid";

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
    <main className="min-h-screen bg-(--page-bg) p-2 transition-colors sm:p-7">

      {/* Toolbar — outside the card, so none of it lands in the download */}

      <div className={`mx-auto mb-3 flex w-full flex-wrap items-center justify-between gap-2 md:max-w-200 ${cardWidthClass}`}>

        {/* Student selector (left) — empty spacer keeps the controls right-aligned when absent */}
        <div className="min-w-0 flex-1">
          {selector}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">

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
                className={`h-5 w-5 rounded-full ring-2 ring-offset-2 ring-offset-(--page-bg) transition ${
                  bgColor === color
                    ? "ring-white"
                    : "ring-transparent hover:ring-white/40"
                }`}
              />
            ))}

          </div>

          <DownloadButton
            busyFormat={busyFormat}
            notice={notice}
            onDownload={download}
          />

        </div>

      </div>

      {/*
        Fit-to-screen: on medium+ screens the whole card is uniformly scaled
        (see useFitToScreen) so a long profile still fits the viewport height
        instead of pushing the page into a scroll. The scale lives on the INNER
        wrapper; the OUTER only reserves the resulting (scaled) height so nothing
        scrolls past the card.
      */}
      <div ref={outerRef} {...swipe}>

        {/*
          The wrapper is a container too, so the card's own min-height can be
          expressed in cqw (a share of its width). Classes ON the card resolve
          against this wrapper; classes on everything INSIDE resolve against the
          card — which is what survives being cloned for the download.
        */}
        <div
          ref={innerRef}
          className={`@container mx-auto w-full md:max-w-200 ${cardWidthClass}`}
        >

        <section
          ref={targetRef}
          className="
      @container relative flex w-full flex-col overflow-hidden
      border border-white/20
      text-white transition-colors
      @min-[760px]:min-h-[133.333cqw]
      @min-[900px]:min-h-[56.25cqw]
          "
        >

          {/* Themed artwork crossfades when the theme changes — every non-active
              layer is painted but transparent, so the switch is a smooth dissolve
              rather than a hard image swap. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {(Object.keys(BACKGROUNDS) as BgColor[]).map((color) => (
              <div
                key={color}
                style={{
                  backgroundImage: `url('${BACKGROUNDS[color]}')`,
                  backgroundColor: FALLBACK_COLOR[color],
                }}
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-[opacity,transform] duration-700 ease-out ${
                  bgColor === color
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-[1.04]"
                }`}
              />
            ))}
          </div>

          {/* Content sits above the artwork layers */}
          <div className="relative z-10 flex w-full flex-1 flex-col">

          {/* Meta strip — folded into the header row on the wide template */}
          <div className="@min-[900px]:hidden">
            <TopMeta />
          </div>

          <Header
            onFetch={onRefresh}
            isFetching={isRefreshing}
            meta={<TopMeta inline />}
          />

          {/*
            One row per band. minmax(0,…) tracks stop a long answer from
            stealing width from the other column, so every student's card has
            the same geometry.
          */}
          <div
            {...{ [UNCLIP_ATTRIBUTE]: "" }}
            className="grid flex-1 grid-cols-1 gap-4 px-5 pb-8 @min-[560px]:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] @min-[560px]:px-9 @min-[900px]:grid-cols-[minmax(0,34%)_minmax(0,1fr)] @min-[900px]:gap-6"
          >

            {/* Photo + info sit at the top of the column, aligned with the first
                JSON line. When the JSON column is taller (a long write-up), the
                leftover space falls to the bottom like a normal sidebar. */}
            <div>

              <PhotoSection
                photo={profile.photo}
                throwbackPhoto={profile.throwbackPhoto}
              />

              <ProfileInfo profile={profile} studentNumber={studentNumber} />

            </div>


            {/*
              The JSON blob. Stacked in one column until the card is wide, then
              flowed into two balanced columns — break-inside-avoid keeps each
              block whole, and the reading order stays 1 → 17 down the first
              column and on into the second.
            */}

            <div className={jsonColumnClass}>

              {/* Opening brace */}

              <div className="rounded-md bg-[#eeeeef] p-4 text-[#20202e]">

                <div className="font-mono text-[10px] @min-[560px]:text-[13px]">
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

                <div className="font-mono text-[10px] @min-[560px]:text-[13px]">

                  <span className="mr-5 text-[#999aaa]">
                    17
                  </span>

                  {"}"}

                </div>

              </div>

            </div>

          </div>


          {/* Side username */}

          <div className="absolute bottom-36 right-2 hidden [writing-mode:vertical-rl] text-[10px] tracking-wider text-gray-300 @min-[560px]:block">
            <span className="font-mono flex items-center">
            <FaInstagram aria-hidden="true" className="mb-1.5 text-[10px]" />
            csc_uncharted
            </span>
          </div>


          {/* Footer */}

          <Footer />

          </div>

        </section>

        </div>

      </div>

    </main>
  );
};

export default Spotlight;
