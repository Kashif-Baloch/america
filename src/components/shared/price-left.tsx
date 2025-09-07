import React from "react";
interface FormProps {
  imgSrc?: string;
}

const PriceLeftSection: React.FC<FormProps> = () => {
  return (
    <div className="flex-1 lg:flex flex-col justify-between hidden bg-[url('/images/pr-bg.jpg')] bg-cover relative overflow-hidden">
      <div className="absolute z-50 top-10 left-10">
        <img src="/images/Logo.webp" className="h-[100px] w-auto" alt="" />
      </div>
    </div>
  );
};

export default PriceLeftSection;
