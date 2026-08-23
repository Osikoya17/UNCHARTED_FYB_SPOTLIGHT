interface ThrowbackProps {
  image?: string;
}

const Throwback = ({ image }: ThrowbackProps) => {
  return (
    <div className="absolute bottom-4 right-4 h-[175px] w-[215px] overflow-hidden rounded-lg border border-gray-400 bg-[#f4f4f4] shadow-[4px_5px_0_rgba(0,0,0,0.12)] sm:h-[190px] sm:w-[230px]">
      
      <div className="flex h-8 items-center justify-between px-2.5 font-sans text-[11px] text-[#20202e]">
        <strong>throwback.png</strong>

        <span className="text-sm tracking-widest">
          − □ ×
        </span>
      </div>

      {image ? (
        <img
          src={image}
          alt="Throwback"
          className="h-[calc(100%-32px)] w-full object-cover"
        />
      ) : (
        <div className="mx-2.5 flex h-[135px] items-center justify-center rounded-lg border-2 border-dashed border-[#a1a1b0] text-center font-mono text-xs leading-5 text-[#76768a]">
          THROWBACK
          <br />
          PHOTO
          <br />
          PLACEHOLDER
        </div>
      )}
    </div>
  );
};

export default Throwback;