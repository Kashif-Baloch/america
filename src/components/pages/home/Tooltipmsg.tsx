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
              <div
                className="p-3 text-sm bg-white dark:bg-[#21222D] text-black dark:text-white rounded-md shadow-lg"
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "280px",
                  zIndex: 50,
                }}
              >
                {t("tooltip")}
              </div>
            }
            side="top"
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
