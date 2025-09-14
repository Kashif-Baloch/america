import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("home");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery === "") {
        handleSearch();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    // Only add 'q' parameter if there's a search query
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    // Preserve other URL parameters
    searchParams?.forEach((value, key) => {
      if (key !== "q") {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className=" mx-auto md:w-11/12 w-full md:max-w-[749px] absolute md:bottom-0 -bottom-[100px] left-1/2 -translate-x-1/2 ">
      <div className="md:bg-white rounded-full md:shadow-2xl  p-2 md:min-h-[88px] min-h-[85px] md:pr-6 px-3 flex items-center gap-4 md:flex-row flex-col">
        <div className="flex bg-white md:bg-transparent items-center focus-within:border-primary-blue flex-1 relative max-md:border md:rounded-none rounded-full md:py-0  max-md:w-full">
          <span className="absolute top-1/2 md:left-2 left-4 -translate-y-1/2">
            <SearchIcon />
          </span>
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className="border-none   md:min-h-[70px] min-h-[65px] shadow-none sm:placeholder:text-lg placeholder:text-sm sm:!text-xl text-sm placeholder:text-placeholder ring-0 outline-none flex-1 placeholder:font-sf placeholder:tracking-wide md:pl-10 pl-12 "
          />
        </div>
        <Button
          onClick={() => {
            if (!session) {
              router.push("/sign-up");
            } else {
              handleSearch();
            }
          }}
          className="bg-primary-blue md:tracking-[1.28px] blue-btn-shadow hover:bg-white hover:text-primary-blue border border-primary-blue text-white md:h-14 h-12 w-max sm:w-[193px] rounded-full font-semibold  cursor-pointer  xl:text-lg  px-5 sm:px-0"
        >
          {t("searchButton")}
        </Button>
      </div>
    </div>
  );
};

export default Searchbar;
