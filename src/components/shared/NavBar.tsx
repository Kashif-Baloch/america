"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import useClickOutsideDetector from "@/hooks/useClickOutsideDetector";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("navbar");
  const locale = useLocale();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const onLoginClick = () => {
    setIsMenuOpen(false);
    router.push("/pricing");
  };

  useClickOutsideDetector(langDropdownRef, () => {
    setIsLangDropdownOpen(false);
  });

  //If Loggedin

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutsideDetector(userDropdownRef, () => setIsUserDropdownOpen(false));

  const handleLogout = () => {
    console.log("Logging out...");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const navItems = [
    { name: t("searchJobs"), href: "/" },
    { name: t("pricing"), href: "/pricing" },
    { name: t("about"), href: "/about" },
    { name: t("healthProfessionals"), href: "/health-professionals" },
    { name: t("visa"), href: "/visa-process" },
    { name: t("faqs"), href: "/faqs" },
    { name: t("contact"), href: "/contact" },
    !isLoggedin ? { name: t("login"), href: "/login" } : { name: "", href: "" },
  ];

  if (!isMounted) {
    return null;
  }

  //Checking for the Active Nav Link
  const isActive = (href: string, currentPath: string) => {
    const localePrefix = `/${locale}`;
    const normalizedPath = currentPath.startsWith(localePrefix)
      ? currentPath.slice(localePrefix.length)
      : currentPath;

    // Handle the root path case
    if (href === "/") {
      return normalizedPath === "/" || normalizedPath === "";
    }

    return normalizedPath.startsWith(href);
  };

  const languages = [
    { code: "en", name: "English", flag: "us" },
    { code: "es", name: "Español", flag: "es" },
    { code: "pt", name: "Português", flag: "pt" },
  ];

  const handleChangeLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|es|pt)/, "");
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsLangDropdownOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={` z-40  font-sf  ${
          pathname === `/${locale}`
            ? "absolute bg-white max-w-[1490px] top-5 left-1/2 -translate-x-1/2 rounded-full w-11/12 px-1"
            : "py-[19px] relative w-full"
        } `}
      >
        <div
          className={`${pathname === `/${locale}` ? "w-full" : "helmet px-1"}`}
        >
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href={"/"}>
                <Image
                  src={"/images/Logo.webp"}
                  alt="Logo"
                  height={1000}
                  width={1000}
                  className="size-14 mt-1 object-cover"
                />
              </Link>
            </div>

            {/* Desktop Navigation - Hidden below 1280px */}
            <div className="hidden xl:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  onClick={() => setIsMenuOpen(false)}
                  href={item.href}
                  className={`min-[1350px]:text-lg text-[17px] hover:text-primary-blue font-medium transition-colors duration-200 flex items-center gap-1 ${
                    isActive(item.href, pathname) ? "text-primary-blue" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side items */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {/* If LoggedIn */}
                {isLoggedin && (
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                      className="focus:outline-none cursor-pointer"
                    >
                      <Avatar className="size-10">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
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
                        <Link
                          href={"/settings"}
                          className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer font-medium"
                        >
                          {t("settings")}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                {/* Language Dropdown */}
                <div className="relative" ref={langDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsLangDropdownOpen((prev) => !prev)}
                    className="flex items-center justify-center cursor-pointer  md:text-lg rounded-full border border-[#DADADA]  bg-transparent text-white h-12 hover:bg-white/10 md:min-w-[120px] max-md:px-3  w-full"
                  >
                    <span
                      className={`fi fi-${
                        locale === "en" ? "us" : locale
                      } size-4`}
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
                          type="button"
                          onClick={() => handleChangeLocale(lang.code)}
                          className="w-full text-left px-6 py-3 text-gray-700 font-medium font-sf sm:text-lg hover:bg-gray-50 focus:bg-gray-50 cursor-pointer flex items-center gap-2"
                        >
                          <span
                            className={`fi fi-${lang.flag} flex-shrink-0 size-4`}
                          />
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Login Button - Hidden below 768px, shown above 768px */}
                <Link
                  href={"/pricing"}
                  onClick={onLoginClick}
                  className="hidden md:inline-flex justify-center items-center bg-primary-blue cursor-pointer  text-white w-44 md:h-14 h-12 text-lg py-2 rounded-full font-semibold hover:bg-white hover:text-primary-blue border border-primary-blue "
                >
                  {t("subscribe")}
                </Link>

                {/* Login Button for tablet view (768px to 1280px) */}
                <Link
                  href={"/pricing"}
                  onClick={onLoginClick}
                  className="md:hidden items-center justify-center flex   bg-primary-blue cursor-pointer  text-white w-max px-5 tracking-wider md:h-14 h-12 text-sm py-2 rounded-full font-semibold hover:bg-white hover:text-primary-blue border border-primary-blue "
                >
                  {t("subscribe")}
                </Link>
              </div>
              {/* Hamburger Menu - Shown below 1280px */}
              <button
                onClick={toggleMenu}
                className="xl:hidden cursor-pointer p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] xl:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 font-sf left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[99] xl:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 ">
            <Link href={"/"} className="flex items-center gap-3">
              <Image
                src={"/images/Logo.webp"}
                alt="Logo"
                height={1000}
                width={1000}
                className="size-12 object-cover"
              />
              <span className="text-lg ">America Working</span>
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 rounded-md cursor-pointer text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 py-6">
            <div className="space-y-1 px-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-3  hover:text-primary-blue hover:bg-ghost-blue rounded-lg font-medium transition-colors duration-200  ${
                    isActive(item.href, pathname) ? "text-primary-blue" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Menu Footer */}
          <div className="p-6 ">
            <Link
              href={"/pricing"}
              onClick={() => {
                onLoginClick?.();
                closeMenu();
              }}
              className="w-full flex items-center justify-center bg-primary-blue cursor-pointer  text-white  md:h-14 h-12 text-lg rounded-full font-semibold hover:bg-white hover:text-primary-blue border border-primary-blue "
            >
              {t("subscribe")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
