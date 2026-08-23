interface JsonLine {
  key: string;
  value: string;
}

interface JsonSectionProps {
  lines: JsonLine[];
  startNumber: number;
}

const JsonSection = ({
  lines,
  startNumber,
}: JsonSectionProps) => {
  return (
    <div className="rounded-md border border-white/40 bg-[#eeeeef] p-4 text-[#808080]">

      {lines.map((line, index) => (
        <div
          key={line.key}
          className="grid grid-cols-[25px_auto_12px_minmax(0,1fr)] gap-1 py-1 text-[10px] leading-5 sm:grid-cols-[30px_auto_15px_minmax(0,1fr)] sm:text-[13px]"
        >

          <span className="text-[#999aaa]">
            {startNumber + index}
          </span>

          <span className="font-bold font-apfel">
            "{line.key}"
          </span>

          <span className="text-gray-500">
            :
          </span>

          <span className="break-words text-black font-mono">
            "{line.value}"
          </span>

        </div>
      ))}

    </div>
  );
};

export default JsonSection;