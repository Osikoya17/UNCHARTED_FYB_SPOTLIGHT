const Footer = () => {
  return (
    <footer className="mt-auto flex items-center justify-between border-t border-white/30 px-5 py-7 @min-[560px]:px-9">

      <div className="font-apfel text-2xl font-black tracking-[-2px] text-white @min-[560px]:text-3xl">
        UNCHARTED
      </div>

      <div className="text-right font-mono text-[8px] leading-4 tracking-wider text-gray-200 @min-[560px]:text-xs">
        COMPUTER SCIENCE & ENGINEERING
        <br />
        CLASS OF 2024/25
      </div>

    </footer>
  );
};

export default Footer;