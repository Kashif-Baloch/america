"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip } from "./tooltip";
import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function Tooltipmsg() {
  const t = useTranslations();
  return (
    <div className="relative">
      <TooltipProvider delayDuration={0}>
        <div className="w-7">
          <Tooltip
            content={
              <div className="p-3 text-sm bg-white text-black  rounded-md shadow-lg">
                {t("tooltip")}
              </div>
            }
            side="bottom"
            align="start"
            className="w-[280px] sm:w-auto"
          >
            <button
              className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center w-[28px] h-[28px]"
              aria-label="Information tooltip"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
