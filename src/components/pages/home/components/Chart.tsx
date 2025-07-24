"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useTranslations } from "next-intl";
interface DataItem {
  country: string;
  income: number;
  flagCode: string;
}
const data: DataItem[] = [
  {
    country: "Colombia",
    income: 300,
    flagCode: "co",
  },
  {
    country: "Mexico",
    income: 420,
    flagCode: "mx",
  },
  {
    country: "Peru",
    income: 310,
    flagCode: "pe",
  },
  {
    country: "EE.UU. (H-2B)",
    income: 3500,
    flagCode: "us",
  },
];

const chartConfig = {
  income: {
    label: "Income",
  },
};

// Custom tick component for rendering flag icons
interface CustomTickProps {
  x: number;
  y: number;

  payload: {
    value: string;
  };
}
const CustomTick = (props: CustomTickProps) => {
  const { x, y, payload } = props;
  const item = data.find((d) => d.country === payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-50} y={0} width={100} height={40}>
        <div className="flex gap-1 justify-center">
          <span
            className={`fi fi-${item?.flagCode} sm:!block !hidden text-[8px] mb-1`}
          ></span>
          <span className="text-xs text-[#6B7280] leading-tight">
            {payload.value}
          </span>
        </div>
      </foreignObject>
    </g>
  );
};

export default function Chart() {
  const t = useTranslations('home');

  return (
    <div className="lg:w-5/12 w-full mx-auto lg:p-6 py-5 border border-[#DADADA] rounded-2xl">
      <Card className="shadow-none border-0 p-0">
        <CardHeader className="">
          <CardTitle className="text-xl font-semibold text-gray-900">
            {t('monthlyIncomeTitle')}

          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={chartConfig}
            className="sm:min-h-[450px] h-[390px]  p-0 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 10,
                }}
                barCategoryGap="10%"
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="country"
                  axisLine={false}
                  tickLine={false}
                  tick={CustomTick}
                  interval={0}
                  height={20}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  domain={[0, 3600]}
                  ticks={[0, 900, 1800, 2700, 3600]}
                />
                <Bar
                  dataKey="income"
                  radius={[4, 4, 0, 0]}
                  label={{
                    position: "top",
                    fontSize: 12,
                    fill: "#6B7280",
                    formatter: (value: number) => `$${value}`,
                  }}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.country === "EE.UU. (H-2B)"
                          ? "#153CF5"
                          : "#153CF51A"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <CardDescription className="text-center mt-4 text-[#9D9D9D] italic">
            Comparison of salaries of country
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
