"use client";

import { useState } from "react";

//Components

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { getFAQData } from "@/Data/FAQData";

export default function FAQTabs() {
  const [activeTab, setActiveTab] = useState("general");
  const t = useTranslations();
  const FAQData = getFAQData(t);

  return (
    <div className="bg-white helmet font-sf">
      {/* FAQ Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-10 bg-[#FBFBFE] border border-[#F1F2F9] flex h-full py-6 justify-center flex-wrap gap-4 gap-y-2.5 px-7">
          {FAQData.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-base tracking-wide cursor-pointer font-normal  flex-0  data-[state=active]:text-white text-tab rounded-full h-9 px-3.5"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* FAQ Data on the base of current Tab */}
        {FAQData.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6">
            <Accordion
              type="single"
              collapsible
              className="flex flex-col gap-y-4"
            >
              {tab.faqs.length > 0 ? (
                tab.faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-tab-content shadow-none border-b-0 data-[state=open]:bg-[linear-gradient(259.52deg,_#FFFFFF_-37.44%,_#F1F0FB_60.89%)]  border-l-6 pl-9 duration-200 border-l-tab-border data-[state=open]:border-l-[#D2CEFF] pb-4"
                  >
                    <AccordionTrigger className="group  text-left font-semibold pt-9 flex items-center justify-between text-[#170F49] text-xl   [&>svg]:hidden hover:no-underline cursor-pointer data-[state=open]:text-primary-blue">
                      <span className="flex items-center gap-2 w-11/12">
                        <ChevronDown className="transition-transform duration-300 text-[#170F49] group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary-blue" />
                        {faq.question}
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className="text-light-black text-base pl-9 w-11/12 font-inter">
                      {faq.answer === "comparison_table" ? (
                        <LocalizedComparisonTable t={t} />
                      ) : (
                        faq.answer
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                // If No FAQ Found Show this message
                <p className="text-center text-gray-500">
                  No FAQs available yet.
                </p>
              )}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

//Table to show a special case in FAQ like Data in Table
type T = ReturnType<typeof useTranslations>;
const LocalizedComparisonTable = ({ t }: { t: T }) => {
  const headings: string[] = t.raw("faq.general.comparison_table.heading");
  const rows: string[][] = t.raw("faq.general.comparison_table.rows");

  return (
    <div className="overflow-auto">
      <table className="min-w-[500px] border border-gray-300 text-sm text-left w-full">
        <thead>
          <tr className="bg-gray-100 text-gray-700 font-semibold">
            {headings.map((heading, idx) => (
              <th key={idx} className="border border-gray-300 p-2">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-gray-300 p-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
