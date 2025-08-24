"use client";

import useClickOutsideDetector from "@/hooks/useClickOutsideDetector";
import { ChevronDown, Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useSession } from "@/lib/auth-client";
import { LogoutUser } from "@/utils/handle-logout";
import { toast } from "sonner";

const TopBar = () => {
  const { data: session } = useSession();
  const tQ = useTranslations("QuickActions");

  const languages = [
    { code: "en", name: "English", flag: "us" },
    { code: "es", name: "Español", flag: "es" },
    { code: "pt", name: "Português", flag: "pt" },
  ];

  const locale = useLocale();
  const t = useTranslations("navbar");
  const router = useRouter();
  const pathname = usePathname();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutsideDetector(langDropdownRef, () => setIsLangDropdownOpen(false));
  useClickOutsideDetector(userDropdownRef, () => setIsUserDropdownOpen(false));

  const handleChangeLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.replace(segments.join("/"));
    setIsLangDropdownOpen(false);
  };

  const handleLogout = async () => {
    await LogoutUser({
      onSuccess: () => {
        toast.success(
          tQ("successMessage", { action: tQ(`actions.logOut.label`) })
        );
      },
    });
    router.push("/login");
  };

  return (
    <div className="w-full py-3 font-sf  flex items-center gap-3 md:justify-end justify-between px-4 border-b border-b-[#DADADA]">
      <Link href={"/admin/jobs"} className="lg:hidden">
        <div className="flex items-center gap-3">
          <Image
            src={"/images/Logo.webp"}
            alt=""
            height={500}
            width={500}
            className=" sm:size-10 size-12 object-contain"
          />
          <h4 className="sm:block hidden text-base font-medium">
            America Working
          </h4>
        </div>
      </Link>
      <div className="flex items-center gap-3">
        <div className="lg:hidden block ">
          <SidebarTrigger className="cursor-pointer">
            <Menu className="size-6 " />
          </SidebarTrigger>
        </div>
        {/* Language Dropdown */}
        <div className="relative w-32" ref={langDropdownRef}>
          <button
            type="button"
            onClick={() => setIsLangDropdownOpen((prev) => !prev)}
            className="flex items-center justify-center cursor-pointer md:text-lg rounded-full border border-[#DADADA] bg-transparent text-white h-12 hover:bg-white/10 md:min-w-[120px] max-md:px-3 w-full"
          >
            <span
              className={`fi fi-${locale === "en" ? "us" : locale} size-4`}
            />
            <span className="ml-2 text-black capitalize">{locale}</span>
            <ChevronDown
              className={`ml-4 h-5 w-5 text-black transition-transform ${
                isLangDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isLangDropdownOpen && (
            <div className="absolute -left-9 mt-2 w-max bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleChangeLocale(lang.code)}
                  className="w-full text-left px-6 py-3 text-gray-700 font-medium font-sf sm:text-lg hover:bg-gray-50 focus:bg-gray-50 flex items-center gap-2"
                >
                  <span className={`fi fi-${lang.flag} flex-shrink-0 size-4`} />
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setIsUserDropdownOpen((prev) => !prev)}
            className="focus:outline-none cursor-pointer"
          >
            <Avatar className="size-10">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>
                {session?.user?.email?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-sm shadow-lg z-50 overflow-hidden">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer font-medium"
              >
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
