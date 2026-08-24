import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ProfileEntry } from "../../lib/loadProfiles";

interface StudentDropdownProps {
  entries: ProfileEntry[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
}

const labelFor = (entry: ProfileEntry): string =>
  entry.profile.fullName || entry.profile.nickname || entry.slug;

/** Everything worth matching a search against, lowercased once per entry. */
const haystackFor = (entry: ProfileEntry): string =>
  [
    entry.profile.firstname,
    entry.profile.lastname,
    entry.profile.nickname,
    entry.slug,
  ]
    .join(" ")
    .toLowerCase();

/**
 * Custom student picker styled to match the FYB Spotlight / JSON aesthetic.
 * The trigger doubles as a search box: open it and type to filter the class,
 * Enter picks the top match.
 */
const StudentDropdown = ({ entries, selectedSlug, onSelect }: StudentDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = entries.find((entry) => entry.slug === selectedSlug) ?? entries[0];

  const haystacks = useMemo(
    () => new Map(entries.map((entry) => [entry.slug, haystackFor(entry)])),
    [entries],
  );

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    // Every whitespace-separated word must appear, so "ade pra" finds
    // "Adebayo Praise" regardless of the order they were typed in.
    const words = needle.split(/\s+/);
    return entries.filter((entry) => {
      const hay = haystacks.get(entry.slug) ?? "";
      return words.every((word) => hay.includes(word));
    });
  }, [entries, haystacks, query]);

  const close = useCallback(() => {
    setOpen(false);
    // Drop the filter so the whole class is there next time it opens.
    setQuery("");
  }, []);

  // Close the panel on outside click or Escape.
  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        close();
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, close]);

  // Opening drops the caret straight into the search box.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const choose = (slug: string) => {
    onSelect(slug);
    close();
  };

  const handleSearchKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && matches.length > 0) {
      event.preventDefault();
      choose(matches[0].slug);
    }
  };

  return (
    <div ref={rootRef} className="relative w-[170px] font-mono sm:w-[240px]">

      {/* Trigger — becomes the search field once open */}
      <div
        className={`flex w-full items-center justify-between gap-3 rounded-md border bg-(--surface) px-3 py-2 text-left transition ${
          open ? "border-white/40" : "border-white/20 hover:border-white/40"
        }`}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <span className="shrink-0 text-[10px] uppercase tracking-wider text-gray-500">
            student
          </span>

          {open ? (
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKey}
              placeholder="search…"
              aria-label="Search students"
              className="min-w-0 flex-1 bg-transparent text-xs font-bold text-[#f4f348] placeholder:font-normal placeholder:text-gray-600 focus:outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="listbox"
              aria-expanded={false}
              className="min-w-0 flex-1 truncate text-left text-xs font-bold text-[#f4f348]"
            >
              {labelFor(selected)}
            </button>
          )}
        </span>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={open ? "Close student list" : "Open student list"}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="text-[10px] text-gray-600">
            {open ? matches.length : entries.length}
          </span>
          <span
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>
      </div>

      {/* Panel */}
      {open && (
        <ul
          role="listbox"
          aria-label="Students"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-white/20 bg-(--surface-strong) py-1 shadow-[6px_6px_0_rgba(0,0,0,0.35)]"
        >
          {matches.length === 0 && (
            <li className="px-3 py-2 text-[10px] uppercase tracking-wider text-gray-500">
              no match
            </li>
          )}

          {matches.map((entry) => {
            const isSelected = entry.slug === selected.slug;
            return (
              <li key={entry.slug} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => choose(entry.slug)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-xs transition hover:bg-white/10 ${
                    isSelected ? "font-bold text-[#f4f348]" : "text-gray-200"
                  }`}
                >
                  <span className="w-6 shrink-0 text-[10px] text-gray-600">
                    {String(entries.indexOf(entry) + 1).padStart(2, "0")}
                  </span>

                  <span className="truncate">
                    {labelFor(entry)}
                  </span>

                  {isSelected && (
                    <span className="ml-auto text-[#4ade80]" aria-hidden="true">
                      ◎
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default StudentDropdown;
