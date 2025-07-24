import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface FormProps {
  imgSrc?: string;
}

const FormLeftSection: React.FC<FormProps> = ({ imgSrc }) => {
  const t = useTranslations();

  return (
    <div className="flex-1 md:flex flex-col justify-between hidden bg-[url('/images/signup-bg.png')] bg-cover relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>

      {/* Logo and Header */}
      <div className="relative z-10 p-8">
        <Link href={"/"}>
          <div className="flex items-center justify-center gap-3 mb-16">
            <Image
              src={"/images/Logo-with-text.svg"}
              alt="Logo"
              height={1000}
              width={1000}
              className="w-[356px] object-cover"
            />

            {/* <span className="text-white text-3xl">America Working</span> */}
          </div>
        </Link>
      </div>

      {/* Illustration Area */}
      <div className="relative z-10 flex items-center justify-center  mb-8">
        <Image
          src={imgSrc || "/images/signup.png"}
          alt="Logo"
          height={1000}
          width={1000}
          className="xl:size-[470px] lg:size-[370px] md:size-[300px] object-cover"
        />
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 px-8 pb-8">
        <h2 className="text-white text-3xl max-w-sm mx-auto font-bold mb-4 text-center">
          {t("headline")}
        </h2>
        <p className="text-white/90 text-center text-lg max-w-sm mx-auto leading-relaxed">
          {t("description")}

        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
    </div>
  );
};

export default FormLeftSection;
