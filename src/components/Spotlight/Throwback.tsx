interface ThrowbackProps {
  image?: string;
}

const Throwback = ({ image }: ThrowbackProps) => {
  return (
    <>
    {image ? (
      <div className="absolute bottom-1 right-1 h-[215px] w-[185px] overflow-hidden rounded-lg border border-gray-400 bg-[#f4f4f4] shadow-[4px_5px_0_rgba(0,0,0,0.12)] sm:h-[220px] sm:w-[190px]">
        
        <div className="flex h-8 items-center justify-between px-2.5 font-mono text-[11px] text-[#20202e]">
          <strong>throwback.png</strong>

          <span className="text-sm tracking-widest flex">
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
            className=" h-[175px] w-full rounded-md object-cover"
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