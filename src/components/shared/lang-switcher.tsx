"use client"
import { ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';
import React, { useRef, useState } from 'react'
import { usePathname, useRouter } from "next/navigation";
import useClickOutsideDetector from '@/hooks/useClickOutsideDetector';
import { cn } from '@/lib/utils';


export const languages = [
    { code: "en", name: "English", flag: "us" },
    { code: "es", name: "Español", flag: "es" },
    { code: "pt", name: "Português", flag: "pt" },
];

const LangSwitcher = ({ className, textColor = "black" }: { className?: string, textColor?: string }) => {
    const router = useRouter();

    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const langDropdownRef = useRef<HTMLDivElement>(null);
    const locale = useLocale();
    const pathname = usePathname();

    const handleChangeLocale = (newLocale: string) => {
        const segments = pathname.split("/");
        segments[1] = newLocale;
        router.replace(segments.join("/"));
        setIsLangDropdownOpen(false);
    };

    useClickOutsideDetector(langDropdownRef, () => {
        setIsLangDropdownOpen(false);
    });

    return (
        <div className="relative" ref={langDropdownRef}>
            <button
                type="button"
                onClick={() => setIsLangDropdownOpen((prev) => !prev)}
                className={cn("flex items-center justify-center cursor-pointer  md:text-lg rounded-full border border-[#DADADA]  bg-transparent text-white h-12 hover:bg-white/10 md:min-w-[120px] max-md:px-3  w-full", className)}
            >
                <span
                    className={`fi fi-${locale === "en" ? "us" : locale
                        } size-4`}
                />
                <span className="ml-2 capitalize"
                    style={{
                        color: textColor
                    }}
                >{locale}</span>
                <ChevronDown
                    style={{
                        color: textColor
                    }}
                    className={`ml-4 h-5 w-5  transition-transform ${isLangDropdownOpen ? "rotate-180" : ""
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
    )
}

export default LangSwitcher
