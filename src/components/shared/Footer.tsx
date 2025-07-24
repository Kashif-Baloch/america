import Image from "next/image";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="relative max-xl:bg-center font-sf md:h-[670px] md:pt-0 pt-14 bg-[url('/images/footer-bg.png')] grid place-items-end bg-cover text-white overflow-hidden">
      <div className="relative z-10 px-6 md:pb-16 pb-8 py-16  flex flex-col justify-center helmet">
        {/* Main content */}
        <div className="text-left md:mb-16 mb-10">
          <h2 className="lg:text-6xl sm:text-4xl text-[32px]  mb-8">
            {t("headline")}
          </h2>
          <Link
            href={"/login"}
            className="bg-white text-black hover:bg-black hover:text-white duration-300 cursor-pointer  w-44 md:h-14 h-12 md:w-[271px] rounded-full text-lg font-medium flex justify-center items-center"
          >
            {t("login")}
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-wrap justify-start md:gap-16 sm:gap-7 gap-4 mb-10">
          <Link
            href="/pricing"
            className="text-white/90 hover:text-white transition-colors"
          >
            {t("subscription")}
          </Link>
          <Link
            href="/faqs"
            className="text-white/90 hover:text-white transition-colors"
          >
            {t("faqs")}
          </Link>
          <Link
            href="/visa-process"
            className="text-white/90 hover:text-white transition-colors"
          >
            {t("visa")}
          </Link>
          <Link
            href="/about"
            className="text-white/90 hover:text-white transition-colors"
          >
            {t("about")}
          </Link>
          <Link
            href="/contact"
            className="text-white/90 hover:text-white transition-colors"
          >
            {t("contact")}
          </Link>
        </nav>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row border-t border-t-white/30 pt-4 items-center justify-between gap-6">
          <div className="text-white/80 text-sm">
            © {new Date().getFullYear()} American Working.{t("rights")}
          </div>

          <div className="flex items-center">
            <Link href={"/"}>
              <Image
                src={"/images/Logo.webp"}
                alt=""
                height={1000}
                width={1000}
                className="size-[90px] object-contain"
              />
            </Link>
          </div>

          <div className="flex gap-6">
            <Link
              target="_blank"
              href="https://drive.google.com/file/d/14uzbCaj0IAxFLJvCLm8OGInaOPsd3_4Q/view?usp=sharing"
              className="text-white/80 hover:text-white transition-colors text-sm"
            >
              {t("terms")}
            </Link>
            <Link
              href="https://drive.google.com/file/d/1kh3dfsmNJ1ziv7pxqKa9pz-IqPnXdi-5/view?usp=sharing"
              target="_blank"
              className="text-white/80 hover:text-white transition-colors text-sm"
            >
              {t("privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
