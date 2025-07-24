"use client";

import { CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  {
    name: "Recruiting Agency\n(Third Party)",
    value: 2500,
    label: "$2,500 charged\nby agency",
    color: "#153CF5",
  },
  {
    name: "Legal Immigration\nAdvice (Lawyers)",
    value: 300,
    label: "$200 for 30\nmins of legal\nadvice",
    color: "#E8ECFE",
  },
  {
    name: "America Working\n(Monthly Subscription)",
    value: 240,
    label: "$28 for 30\ndays of access",
    color: "#CB9442",
  },
];

interface CustomTickProps {
  x?: number;
  y?: number;
  payload: {
    value: string;
  };
}

const CustomTick = ({ x, y, payload }: CustomTickProps) => {
  const lines = payload.value.split("\n");
  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line: string, index: number) => (
        <text
          key={index}
          x={0}
          y={index * 16 + 10}
          textAnchor="middle"
          // fontSize="12"
          className="sm:text-xs sm:mx-0 mx-1 text-[10px] leading-[1.1]"
          fill="#64748b"
          fontWeight="500"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

interface YAxisTickProps {
  x?: number;
  y?: number;
  payload: {
    value: number;
  };
}
// To show Value below Bars
const CustomYAxisTick = ({ x, y, payload }: YAxisTickProps) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-10}
        dy={4}
        textAnchor="end"
        fontSize="12"
        fill="#64748b"
        fontWeight="400"
        className=""
      >
        {payload.value}
      </text>
    </g>
  );
};
const chartConfig = {
  income: {
    label: "Income",
  },
};
export default function CostComparisonChart() {
  const t = useTranslations("pricing.benefits");

  return (
    <div className="lg:w-5/12 w-full">
      <div className="mx-auto lg:p-6 p-3 pt-5 border shadow border-[#DADADA] rounded-2xl">
        <CardTitle className="text-xl font-semibold text-gray-900 w-full">
          {t("chartTitle")}
        </CardTitle>

        <div className=" w-full relative">
          <ChartContainer
            config={chartConfig}
            className="sm:min-h-[400px] h-[390px]  p-0 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 60,
                  right: 7,
                  left: 10,
                  bottom: 20,
                }}
                barCategoryGap="5%"
              >
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={CustomTick}
                  interval={0}
                  // height={20}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={CustomYAxisTick}
                  domain={[0, 2500]}
                  ticks={[0, 500, 1000, 1500, 2000, 2500]}
                  // width={60}
                />
                <text
                  x={50}
                  y={170}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#64748b"
                  transform="rotate(-90, 40, 200)"
                  fontWeight="500"
                >
                  Cost in USD
                </text>
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          {/* Custom labels above bars */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Label for first bar */}
            <div className="absolute lg:left-[29%] sm:left-[23%] left-[30%] top-[5%] -translate-x-1/2">
              <div className="text-center">
                <div className="text-xs leading-[1.1] font-semibold text-gray-700 w-28 whitespace-pre-line">
                  $2,500 charged{"\n"}by agency
                </div>
              </div>
            </div>

            {/* Label for second bar */}
            <div className="absolute lg:left-[55%] sm:left-[53%] left-[58%] bottom-[22%] -translate-x-1/2">
              <div className="text-center">
                <div className="text-xs leading-[1.1] font-semibold text-gray-700 whitespace-pre-line sm:w-32 w-24">
                  $200 for 30{"\n"}mins of legal{"\n"}advice
                </div>
              </div>
            </div>

            {/* Label for third bar */}
            <div className="absolute left-[83%] lg:bottom-[22%] bottom-[20%] -translate-x-1/2">
              <div className="text-center">
                <div className="text-xs leading-[1.1] font-semibold text-gray-700 whitespace-pre-line">
                  $28 for 30{"\n"}days of access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-6 font-sf">{t("chartNote")}</p>
    </div>
  );
}
