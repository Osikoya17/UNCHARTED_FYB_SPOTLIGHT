import type { ReactNode } from "react";

interface HeaderProps {
  /** Called when the [FETCH:USER DATA] button is clicked. */
  onFetch?: () => void;
  /** When true the button shows a fetching state and is disabled. */
  isFetching?: boolean;
  /**
   * Timestamp / coordinates strip. On the wide template it sits between the
   * title and the button; narrower cards show it above the header instead, so
   * this slot hides itself below that width.
   */
  meta?: ReactNode;
}

const Header = ({ onFetch, isFetching = false, meta }: HeaderProps) => {
  return (
    <header className="flex mt-4 items-start justify-between px-5 pb-6 pt-4 @min-[560px]:px-9">
      <h1 className="font-wilhem text-2xl font-normal leading-[0.85] tracking-normal text-white @min-[560px]:text-3xl @min-[900px]:text-5xl">
        FYB
        <br />
        SPOTLIGHT
      </h1>

      {meta && (
        <div className="hidden min-w-0 flex-1 @min-[900px]:block">
          {meta}
        </div>
      )}

      <div className="ml-4 flex shrink-0 flex-col items-end gap-2">
        <img
          src="/UN (+ icon)-w.png"
          alt="Uncharted"
          className="h-9 w-auto @min-[560px]:h-12 @min-[900px]:h-16"
        />

        <button
          type="button"
          onClick={onFetch}
          disabled={isFetching}
          className="bg-[#f6b8d9] px-4 py-3 font-mono text-[10px] font-bold text-[#161625] shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition hover:translate-x-0.5 hover:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-x-0 disabled:hover:translate-y-0 @min-[560px]:px-7 @min-[560px]:text-xs"
        >
          <span
            className={`mr-2 inline-block h-2.5 w-2.5 rounded-full border ${
              isFetching
                ? "animate-pulse border-amber-700 bg-amber-400"
                : "border-green-700 bg-green-400"
            }`}
          />

          {isFetching ? "[FETCHING…]" : "[FETCH:USER DATA]"}
        </button>
      </div>
    </header>
  );
};

export default Header;
