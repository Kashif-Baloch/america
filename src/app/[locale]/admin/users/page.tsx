"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    subscription: "Basic",
    pricing: "$10/month",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    subscription: "Premium",
    pricing: "$30/month",
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    subscription: "Enterprise",
    pricing: "$100/month",
  },
  {
    name: "Bob Brown",
    email: "bob@example.com",
    subscription: "Basic",
    pricing: "$10/month",
  },
];

const Page = () => {
  const t = useTranslations("dashboardJobs");
  const t2 = useTranslations("table");
  return (
    <div className="px-4 py-12 font-sf  ">
      <h2 className="text-4xl text-center font-bold text-gray-900 mb-2">
        {t("UsersPage")}
      </h2>
      <div className="overflow-x-auto rounded-lg border mt-10 w-full">
        <Table className="text-lg w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="py-4 px-2">{t2("name")}</TableHead>
              <TableHead className="py-4 px-2">{t2("email")}</TableHead>
              <TableHead className="py-4 px-2">
                {t2("subscriptionType")}
              </TableHead>
              <TableHead className="py-4 px-2">{t2("pricing")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell className="px-2 py-4">{user.name}</TableCell>
                <TableCell className="px-2 py-4">{user.email}</TableCell>
                <TableCell className="px-2 py-4">{user.subscription}</TableCell>
                <TableCell className="px-2 py-4">{user.pricing}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;
