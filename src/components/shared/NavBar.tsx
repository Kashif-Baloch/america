"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import useClickOutsideDetector from "@/hooks/useClickOutsideDetector";
import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { useSession } from "@/lib/auth-client";
import { LogoutUser } from "@/utils/handle-logout";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LangSwitcher from "./lang-switcher";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tQ = useTranslations("QuickActions");
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("navbar");
  const locale = useLocale();

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

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isUserDropdownOpen2, setIsUserDropdownOpen2] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef2 = useRef<HTMLDivElement>(null);

  useClickOutsideDetector(userDropdownRef, () => setIsUserDropdownOpen(false));
  useClickOutsideDetector(userDropdownRef2, () =>
    setIsUserDropdownOpen2(false)
  );

  const [showConsultation, setShowConsultation] = useState(false);

  const handleLogout = async () => {
    await LogoutUser({
      onSuccess: () => {
        toast.success(
          tQ("successMessage", { action: tQ(`actions.logOut.label`) })
        );
        setShowConsultation(false);
        window.location.href = "/";
      },
    });
  };

  useEffect(() => {
    const checkSubscription = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch("/api/check-pro-plus");
          const data = await res.json();
          setShowConsultation(data.hasProPlus);
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
    };

    checkSubscription();
  }, [session]);

  const navItems = [
    { name: t("searchJobs"), href: "/" },

    ...(session?.user ? [{ name: t("favorites"), href: `/favorites` }] : []),

    ...(showConsultation
      ? [{ name: "Consultation", href: `/consultation` }]
      : []),

    { name: t("pricing"), href: "/pricing" },
    { name: t("about"), href: "/about" },
    { name: t("healthProfessionals"), href: "/health-professionals" },
    { name: t("visa"), href: "/visa-process" },
    { name: t("faqs"), href: "/faqs" },
    { name: t("contact"), href: "/contact" },
    !session?.user
      ? { name: t("login"), href: "/login" }
      : { name: "", href: "" },
  ];

  if (!isMounted) {
    return null;
  }

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

  return (
    <>
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
                {session?.user && (
                  <div
                    className="relative sm:flex hidden"
                    ref={userDropdownRef}
                  >
                    <button
                      onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                      className="focus:outline-none cursor-pointer"
                    >
                      <Avatar className="size-10">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback>
                          {session.user.email.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>

                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 top-full rounded-sm shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer font-medium"
                        >
                          {t("logout")}
                        </button>
                        <Link
                          href={"/settings"}
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer font-medium"
                        >
                          {t("settings")}
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <LangSwitcher />

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
            {session?.user ? (
              <div className="relative sm:hidden w-full" ref={userDropdownRef2}>
                <div className="relative sm:hidden w-full">
                  <div
                    onClick={() => setIsUserDropdownOpen2((prev) => !prev)}
                    aria-haspopup="menu"
                    aria-expanded={isUserDropdownOpen2}
                    className="flex items-center justify-start cursor-pointer gap-3"
                  >
                    <button
                      type="button"
                      className="focus:outline-none cursor-pointer"
                    >
                      <Avatar className="size-10">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback>
                          {(
                            session.user.email?.slice(0, 1) || "U"
                          ).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>

                    {/* Name + Email */}
                    <div className="min-w-0">
                      <p className="font-medium leading-tight">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  {isUserDropdownOpen2 && (
                    <div
                      role="menu"
                      className="absolute left-0 bottom-full mb-2 w-full bg-white border border-gray-200 rounded-sm shadow-lg z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMenu();
                        }}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer font-medium"
                        role="menuitem"
                      >
                        {t("logout")}
                      </button>
                      <Link
                        href="/settings"
                        onClick={() => {
                          closeMenu();
                        }}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer font-medium"
                        role="menuitem"
                      >
                        {t("settings")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
