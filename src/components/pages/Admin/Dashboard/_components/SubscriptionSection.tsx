"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SubscriptionSection = () => {
  const t = useTranslations("dashboard");

  const subscriptionTypesData = [
    { name: "Monthly", value: 400 },
    { name: "Quarterly", value: 300 },
  ];

  const renewalCancellationData = [
    { name: "Week 1", renewals: 4000, cancellations: 2400 },
    { name: "Week 2", renewals: 3000, cancellations: 1398 },
    { name: "Week 3", renewals: 2000, cancellations: 9800 },
    { name: "Week 4", renewals: 2780, cancellations: 3908 },
  ];

  const cancellationReasonsData = [
    { name: "Too expensive", value: 35 },
    { name: "Found alternative", value: 25 },
    { name: "No matching jobs", value: 20 },
    { name: "Confusing platform", value: 10 },
    { name: "Other", value: 10 },
  ];

  const COLORS = ["#153cf5", "#00C49F", "#FFBB28", "#FF8042"];
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{t("sections.subscriptions")}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{t("charts.revenueTrends")}</CardTitle>
            <CardDescription>{t("charts.revenueDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="pl-5">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={renewalCancellationData}>
                <CartesianGrid strokeDasharray="1" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="renewals"
                  stroke="#153cf5"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="cancellations"
                  stroke="#82ca9d"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("charts.subscriptionTypes")}</CardTitle>
            <CardDescription>
              {t("charts.subscriptionTypesDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart className="w-full size-full">
                <Pie
                  data={subscriptionTypesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#153cf5"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {subscriptionTypesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("charts.cancellationReasons")}</CardTitle>
            <CardDescription>
              {t("charts.cancellationDescription")}
            </CardDescription>
            <div className="mt-4 space-y-2">
              {cancellationReasonsData.map((reason, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium">
                    {reason.name}: {reason.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cancellationReasonsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {cancellationReasonsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{t("charts.renewalCancellation")}</CardTitle>
            <CardDescription>{t("charts.renewalDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={renewalCancellationData}>
                <CartesianGrid strokeDasharray="1" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Legend />
                <Bar dataKey="renewals" fill="#153cf5" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="cancellations"
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SubscriptionSection;
