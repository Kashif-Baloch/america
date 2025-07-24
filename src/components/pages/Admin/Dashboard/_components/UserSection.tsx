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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserSection = () => {
  const t = useTranslations("dashboard");

  // Sample data - replace with real API data
  const userActivityData = [
    { name: "Mon", users: 4000, resumes: 120, avgSession: 8.2 },
    { name: "Tue", users: 3000, resumes: 90, avgSession: 7.5 },
    { name: "Wed", users: 5000, resumes: 150, avgSession: 9.1 },
    { name: "Thu", users: 2780, resumes: 85, avgSession: 7.8 },
    { name: "Fri", users: 1890, resumes: 60, avgSession: 6.5 },
    { name: "Sat", users: 2390, resumes: 75, avgSession: 7.0 },
    { name: "Sun", users: 3490, resumes: 110, avgSession: 8.5 },
  ];

  const countryData = [
    { name: "USA", value: 400 },
    { name: "Brazil", value: 300 },
    { name: "Mexico", value: 200 },
    { name: "Canada", value: 100 },
    { name: "UK", value: 150 },
    { name: "Germany", value: 120 },
  ];

  const topJobSearchesPerUser = [
    {
      user: "user1@example.com",
      searches: [
        "Software Engineer",
        "Data Analyst",
        "Product Manager",
        "UX Designer",
        "DevOps",
      ],
    },
    {
      user: "user2@example.com",
      searches: [
        "Marketing Manager",
        "Content Writer",
        "SEO Specialist",
        "Social Media",
        "Graphic Designer",
      ],
    },
    {
      user: "user3@example.com",
      searches: [
        "Accountant",
        "Financial Analyst",
        "Auditor",
        "Tax Specialist",
        "Bookkeeper",
      ],
    },
    {
      user: "user2@example.com",
      searches: [
        "Marketing Manager",
        "Content Writer",
        "SEO Specialist",
        "Social Media",
        "Graphic Designer",
      ],
    },
    {
      user: "user3@example.com",
      searches: [
        "Accountant",
        "Financial Analyst",
        "Auditor",
        "Tax Specialist",
        "Bookkeeper",
      ],
    },
  ];

  const topGlobalJobSearches = [
    { query: "Software Engineer", count: 1200 },
    { query: "Data Analyst", count: 980 },
    { query: "Product Manager", count: 800 },
    { query: "UX Designer", count: 650 },
    { query: "DevOps Engineer", count: 520 },
    { query: "Marketing Manager", count: 480 },
    { query: "Financial Analyst", count: 450 },
    { query: "HR Specialist", count: 420 },
    { query: "Sales Executive", count: 400 },
    { query: "Customer Support", count: 380 },
    { query: "Graphic Designer", count: 350 },
    { query: "Content Writer", count: 320 },
    { query: "Project Manager", count: 300 },
    { query: "Business Analyst", count: 280 },
    { query: "Accountant", count: 250 },
    { query: "SEO Specialist", count: 220 },
    { query: "Social Media Manager", count: 200 },
    { query: "Operations Manager", count: 180 },
    { query: "Data Scientist", count: 150 },
    { query: "UI Designer", count: 120 },
  ];

  const popularJobPostings = [
    {
      title: "Senior Software Engineer (Remote)",
      views: 1500,
      saves: 320,
      applications: 180,
    },
    {
      title: "Data Analyst - Financial Sector",
      views: 1200,
      saves: 280,
      applications: 150,
    },
    {
      title: "Product Manager - E-commerce",
      views: 1100,
      saves: 250,
      applications: 130,
    },
    {
      title: "UX Designer - Mobile Apps",
      views: 950,
      saves: 220,
      applications: 110,
    },
    {
      title: "DevOps Engineer - AWS",
      views: 900,
      saves: 200,
      applications: 100,
    },
    { title: "Marketing Director", views: 850, saves: 180, applications: 90 },
    { title: "Financial Controller", views: 800, saves: 170, applications: 85 },
    { title: "HR Business Partner", views: 750, saves: 160, applications: 80 },
    {
      title: "Sales Manager - Enterprise",
      views: 700,
      saves: 150,
      applications: 75,
    },
    {
      title: "Customer Success Manager",
      views: 680,
      saves: 140,
      applications: 70,
    },
  ];

  const resumeUploadStats = {
    today: 42,
    thisWeek: 280,
    thisMonth: 1120,
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">{t("sections.users")}</h2>

      {/* First Row - Country Distribution and Session Time */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Users by Country */}
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.usersByCountry")}</CardTitle>
            <CardDescription>{t("charts.countryDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  fill="#153cf5"
                  name="Users"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Average Session Time */}
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.avgSessionTime")}</CardTitle>
            <CardDescription>
              {t("charts.avgSessionDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="1" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgSession"
                  stroke="#153cf5"
                  name="Minutes"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Job Searches */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Searches Per User */}
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.userSearches")}</CardTitle>
            <CardDescription>
              {t("charts.userSearchesDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topJobSearchesPerUser.map((user, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <p className="font-medium mb-2">{user.user}</p>
                  <div className="space-y-1">
                    {user.searches.map((search, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <span className="mr-2 text-muted-foreground">
                          {i + 1}.
                        </span>
                        <span>{search}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Global Top Searches */}
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.globalSearches")}</CardTitle>
            <CardDescription>
              {t("charts.globalSearchesDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] overflow-y-auto">
            <div className="space-y-3">
              {topGlobalJobSearches.map((search, index) => (
                <div key={index} className="flex items-center">
                  <div className="ml-2 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {search.query}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {search.count.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Job Postings and Resume Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Popular Job Postings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.popularJobs")}</CardTitle>
            <CardDescription>
              {t("charts.popularJobsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] overflow-y-auto">
            <div className="space-y-4">
              {popularJobPostings.map((job, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <p className="font-medium mb-2 line-clamp-1">{job.title}</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">
                        {job.views.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">
                        {job.saves.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground">Saves</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">
                        {job.applications.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground">Apps</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resume Uploads and High Application Jobs */}
        <div className="space-y-4">
          {/* Resume Upload Stats */}
          <Card>
            <CardHeader>
              <CardTitle>{t("charts.resumeUploads")}</CardTitle>
              <CardDescription>
                {t("charts.resumesDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="border rounded-lg p-4">
                  <p className="text-2xl font-bold">
                    {resumeUploadStats.today}
                  </p>
                  <p className="text-muted-foreground">Today</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-2xl font-bold">
                    {resumeUploadStats.thisWeek}
                  </p>
                  <p className="text-muted-foreground">This Week</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-2xl font-bold">
                    {resumeUploadStats.thisMonth}
                  </p>
                  <p className="text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* High Application Rate Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>{t("charts.highApplicationJobs")}</CardTitle>
              <CardDescription>
                {t("charts.highApplicationDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] overflow-y-auto">
              <div className="space-y-3">
                {popularJobPostings
                  .sort((a, b) => b.applications - a.applications)
                  .slice(0, 5)
                  .map((job, index) => (
                    <div key={index} className="flex items-center">
                      <div className="ml-2 space-y-1">
                        <p className="text-sm font-medium leading-none line-clamp-1">
                          {job.title}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {job.applications.toLocaleString()} apps
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UserSection;
