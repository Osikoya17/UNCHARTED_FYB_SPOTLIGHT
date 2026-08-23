const TopMeta = () => {
  return (
    <div className="flex mt-4 md:mt-7 items-center justify-between px-5 py-2 sm:px-9">
      <img
        src="/Time.png"
        alt="2026-04-13T06:06:00 UTC+01:00"
        className="h-2.5 w-auto sm:h-3"
      />

      <img
        src="/Coordinates.png"
        alt="N7°32'24 – N7°32'29 · E4°27'46 – E4°27'59"
        className=" hidden h-3 w-auto md:block"
      />
    </div>
  );
};

export default TopMeta;