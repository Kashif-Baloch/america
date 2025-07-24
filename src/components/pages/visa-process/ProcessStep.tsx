import type React from "react";

interface ProcessStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
}

export function ProcessStep({
  icon: Icon,
  title,
  description,
}: ProcessStepProps) {
  return (
    <div className="relative z-20 flex items-start sm:gap-6 gap-5 group">
      <div className="bg-white">
        <div className="grid place-items-center bg-[#1C34A7]/10 sm:size-16 size-14 rounded-full ">
          {Icon}
        </div>
      </div>
      <div className="">
        <h3 className="md:text-[27px]  sm:text-[24px] text-[22px] font-inter leading-[1.2] font-bold text-left mb-4">
          {title}
        </h3>
        <p className="sm:mt-3 mt-2 text-left font-sf">{description}</p>
      </div>
    </div>
  );
}
