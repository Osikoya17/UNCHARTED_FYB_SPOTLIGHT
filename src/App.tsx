import { useState, type ReactNode } from "react";

import Spotlight from "./components/Spotlight/Spotlight";
import StudentDropdown from "./components/ui/StudentDropdown";
import ProfileNavButton from "./components/ui/ProfileNavButton";
import { useProfiles } from "./hooks/useProfiles";
import { withSlugs } from "./lib/loadProfiles";

/** Read the `?student=<slug>` value from the URL on first load. */
function readSlugFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get("student");
}

/** Centered full-screen message that matches the dark Spotlight theme. */
function StatusScreen({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-(--page-bg) p-6 text-center font-mono text-sm text-gray-300">
      <div>{children}</div>
    </main>
  );
}

function App() {
  const { status, profiles, error, isRefreshing, reload } = useProfiles();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(readSlugFromUrl);

  if (status === "loading") {
    return <StatusScreen>Loading profiles…</StatusScreen>;
  }

  if (status === "error") {
    return (
      <StatusScreen>
        <p className="mb-2 text-[#f6b8d9]">Couldn’t load profiles.</p>
        <p className="mb-4 text-gray-500">{error}</p>
        <button
          type="button"
          onClick={reload}
          className="border border-white/30 px-4 py-2 font-mono text-xs uppercase tracking-wider text-gray-200 transition hover:bg-white/10"
        >
          Retry
        </button>
      </StatusScreen>
    );
  }

  const entries = withSlugs(profiles);

  if (entries.length === 0) {
    return <StatusScreen>No profiles found in the sheet yet.</StatusScreen>;
  }

  const selected = entries.find((entry) => entry.slug === selectedSlug) ?? entries[0];

  const selectStudent = (slug: string) => {
    setSelectedSlug(slug);
    const url = new URL(window.location.href);
    url.searchParams.set("student", slug);
    window.history.replaceState({}, "", url);
  };

  // Arrow navigation wraps around, so browsing the whole class never dead-ends.
  const selectedIndex = entries.indexOf(selected);
  const neighbour = (delta: number) =>
    entries[(selectedIndex + delta + entries.length) % entries.length];

  const goPrev = () => selectStudent(neighbour(-1).slug);
  const goNext = () => selectStudent(neighbour(1).slug);

  const nameOf = (index: number) => {
    const { profile } = entries[index];
    return profile.firstname || profile.nickname || entries[index].slug;
  };

  return (
    <Spotlight
      profile={selected.profile}
      studentNumber={selectedIndex + 1}
      onRefresh={reload}
      isRefreshing={isRefreshing}
      onPrev={entries.length > 1 ? goPrev : undefined}
      onNext={entries.length > 1 ? goNext : undefined}
      selector={
        entries.length > 1 ? (
          <div className="flex min-w-0 items-center gap-2">

            {/* Arrows are for pointer devices; on phones they're hidden and a
                left/right swipe on the card navigates instead (see Spotlight). */}
            <span className="hidden sm:flex">
              <ProfileNavButton
                direction="prev"
                onClick={goPrev}
                targetLabel={nameOf(entries.indexOf(neighbour(-1)))}
              />
            </span>

            <StudentDropdown
              entries={entries}
              selectedSlug={selected.slug}
              onSelect={selectStudent}
            />

            <span className="hidden sm:flex">
              <ProfileNavButton
                direction="next"
                onClick={goNext}
                targetLabel={nameOf(entries.indexOf(neighbour(1)))}
              />
            </span>

          </div>
        ) : undefined
      }
    />
  );
}

export default App;
