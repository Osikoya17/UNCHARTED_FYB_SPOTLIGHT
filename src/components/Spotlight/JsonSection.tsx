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
    <div className="rounded-md border border-white/40 bg-[#eeeeef] p-2 text-[#808080]">

      {lines.map((line, index) => (
        <div
          key={line.key}
          className="grid grid-cols-[25px_minmax(0,1fr)] gap-1 text-[10px] leading-5 @min-[560px]:grid-cols-[30px_minmax(0,1fr)] @min-[560px]:text-[13px] @min-[560px]:leading-loose"
        >

          <span className="text-[#999aaa]">
            {startNumber + index}
          </span>

          {/*
            Hanging indent: the whole "key": "value" pair flows as one block.
            padding-left sets a FIXED left indentation for every wrapped line,
            and the matching negative text-indent pulls the first line back
            flush with the gutter — so continuation lines always align to the
            same x regardless of how long the key is.
          */}
          <p className="wrap-break-word pl-5 -indent-5">
            <span className="font-normal font-apfel text-[#999aaa]">"{line.key}"</span>
            <span className="text-gray-500">:</span>{""}
            <span className="font-mono text-black">"{line.value}"</span>
          </p>

        </div>
      ))}

    </div>
  );
};

export default JsonSection;