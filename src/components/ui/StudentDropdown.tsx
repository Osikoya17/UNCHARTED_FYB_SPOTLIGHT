import { useEffect, useRef, useState } from "react";

import type { ProfileEntry } from "../../lib/loadProfiles";

interface StudentDropdownProps {
  entries: ProfileEntry[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
}

const labelFor = (entry: ProfileEntry): string =>
  entry.profile.fullName || entry.profile.nickname || entry.slug;

/**
 * Custom student picker styled to match the FYB Spotlight / JSON aesthetic.
 * Lists every student from the sheet; selecting one shows their details.
 */
const StudentDropdown = ({ entries, selectedSlug, onSelect }: StudentDropdownProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = entries.find((entry) => entry.slug === selectedSlug) ?? entries[0];

  // Close the panel on outside click or Escape.
  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const choose = (slug: string) => {
    onSelect(slug);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative w-[170px] font-mono sm:w-[240px]">

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-md border border-white/20 bg-[#12122a] px-3 py-2 text-left transition hover:border-white/40"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">
            student
          </span>
          <span className="truncate text-xs font-bold text-[#f4f348]">
            {labelFor(selected)}
          </span>
        </span>

        <span className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600">
            {entries.length}
          </span>
          <span
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            ▾
          </span>
        </span>
      </button>

      {/* Panel */}
      {open && (
        <ul
          role="listbox"
          aria-label="Students"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-white/20 bg-[#0d0d20] py-1 shadow-[6px_6px_0_rgba(0,0,0,0.35)]"
        >
          {entries.map((entry, index) => {
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
                    {String(index + 1).padStart(2, "0")}
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
