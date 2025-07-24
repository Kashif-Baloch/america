import { useTranslations } from "next-intl";
import Image from "next/image";

const Page = () => {
  const t = useTranslations("healthHero");
  return (
    <>
      <div className="helmet font-sf ">
        <div className="mb-8 flex flex-col items-center md:pt-20 pt-10">
          <h1 className="md:text-[48px] sm:text-4xl text-3xl font-bold max-w-[700px] mx-auto text-center   leading-[1.2] mb-6">
            {t("titleStart")}{" "}
            <span className="inline-block text-primary-blue  px-1 rounded-sm">
              {t("highlight")}
            </span>{" "}
            {t("titleEnd")}
          </h1>

          <Image
            src={"/images/health-professionals-main.jpg"}
            alt="Image"
            height={1000}
            width={1000}
            className="rounded-3xl"
          />
        </div>
      </div>
    </>
  );
};

export default Page;
