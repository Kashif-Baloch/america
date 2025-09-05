"use client";

import DetailsSub from "@/components/pages/home/DetailsSubs";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  const { data: session } = useSession();
  if (!session) {
    redirect(`/login`);
  }
  return (
    <div>
      <DetailsSub />
    </div>
  );
};

export default Page;
