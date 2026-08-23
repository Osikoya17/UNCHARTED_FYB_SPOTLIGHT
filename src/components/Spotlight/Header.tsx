interface HeaderProps {
  /** Called when the [FETCH:USER DATA] button is clicked. */
  onFetch?: () => void;
  /** When true the button shows a fetching state and is disabled. */
  isFetching?: boolean;
}

const Header = ({ onFetch, isFetching = false }: HeaderProps) => {
  return (
    <header className="flex mt-4 md:mt-10 items-start justify-between px-5 pb-6 pt-4 sm:px-9">
      <h1 className="font-mono font-normal text-3xl font-black leading-[0.85] tracking-[-4px] text-white sm:text-3xl">
        FYB
        <br />
        SPOTLIGHT
      </h1>

      <button
        type="button"
        onClick={onFetch}
        disabled={isFetching}
        className="mt-1 ml-4 bg-[#f6b8d9] px-4 py-3 font-mono text-[10px] font-bold text-[#161625] shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition hover:translate-x-0.5 hover:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-x-0 disabled:hover:translate-y-0 sm:px-7 sm:text-xs"
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
    </header>
  );
};

export default Header;
