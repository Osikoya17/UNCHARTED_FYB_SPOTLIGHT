interface ThrowbackProps {
  image?: string;
}

const Throwback = ({ image }: ThrowbackProps) => {
  return (
    <>
    {image ? (
      <div className="absolute bottom-1 right-1 h-40 w-35 overflow-hidden rounded-lg border border-gray-400 bg-[#f4f4f4] shadow-[4px_5px_0_rgba(0,0,0,0.12)] @min-[560px]:h-41 @min-[560px]:w-36">
        
        <div className="flex h-8 items-center justify-between px-2.5 font-mono text-[11px] text-[#20202e]">
          <strong>throwback.png</strong>

          <span className="text-sm tracking-widest flex lg:hidden">
            <img src="throwback UI Icons (Minimise).svg" alt=""  />
            <img src="throwback UI Icons (Resize).svg" alt=""  />
            <img src="throwback UI Icons X.svg" alt=""  />
          </span>
        </div>

      
          <div className="mx-1 mt-1 flex  rounded-md font-mono">
          <img
            src={image}
            alt="Throwback"
            /* googleusercontent answers 429 to anything carrying a Referer. */
            referrerPolicy="no-referrer"
            className=" h-30 w-full rounded-md object-cover"
          />
          </div>
        
        </div>
      ) : 
      null
      }
    </>
  );
};

export default Throwback;