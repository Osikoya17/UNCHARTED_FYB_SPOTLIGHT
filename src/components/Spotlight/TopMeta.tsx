interface TopMetaProps {
  /**
   * True when this strip is rendered inside the header row (the wide template)
   * rather than as its own band above it.
   */
  inline?: boolean;
}

const TopMeta = ({ inline = false }: TopMetaProps) => {
  return (
    <div
      className={
        inline
          ? "flex items-center justify-center gap-8 px-4 pt-2"
          : "flex mt-4 @min-[760px]:mt-7 items-center justify-between px-5 py-2 @min-[560px]:px-9"
      }
    >
      <img
        src="/Time.png"
        alt="2026-04-13T06:06:00 UTC+01:00"
        className={inline ? "h-3 w-auto" : "h-2.5 w-auto @min-[560px]:h-3"}
      />

      <img
        src="/Coordinates.png"
        alt="N7°32'24 – N7°32'29 · E4°27'46 – E4°27'59"
        className={inline ? "h-3 w-auto" : "hidden h-3 w-auto md:block @min-[760px]:block"}
      />
    </div>
  );
};

export default TopMeta;
