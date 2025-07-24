"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const OverView = () => {
  const t = useTranslations("dashboard");
  // Sample data - replace with real API data
  const userActivityData = [
    { name: "Mon", users: 4000 },
    { name: "Tue", users: 3000 },
    { name: "Wed", users: 5000 },
    { name: "Thu", users: 2780 },
    { name: "Fri", users: 1890 },
    { name: "Sat", users: 2390 },
    { name: "Sun", users: 3490 },
  ];
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{t("sections.overview")}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg tracking-wide font-medium">
              {t("metrics.activeUsers")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                12.3%
              </span>
              {t("metrics.vsLastWeek")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg tracking-wide font-medium">
              {t("metrics.activeSubscriptions")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,678</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                8.1%
              </span>
              {t("metrics.vsLastMonth")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg tracking-wide font-medium">
              {t("metrics.conversionRate")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="text-red-500 flex items-center">
                <ArrowDown className="h-4 w-4 mr-1" />
                1.1%
              </span>
              {t("metrics.vsLastMonth")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg tracking-wide font-medium">
              {t("metrics.newSignups")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+432</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                15.6%
              </span>
              {t("metrics.vsLastWeek")}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.userActivity")}</CardTitle>
            <CardDescription>
              {t("charts.userActivityDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="1" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#153cf5"
                  strokeWidth={3}
                  activeDot={{ r: 10 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("charts.newSignups")}</CardTitle>
            <CardDescription>{t("charts.signupsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="1 1" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                {/* <Tooltip /> */}
                <Bar dataKey="users" fill="#153cf5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OverView;
