"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoSection } from "./_components/PersonalInfoSection";
import { ResumeSection } from "./_components/ResumeSection";
import { SubscriptionSection } from "./_components/SubscriptionSection";
import { WelcomeSection } from "./_components/WelcomeSection";

import { Link, redirect } from "@/i18n/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { FavoritesSection } from "./_components/FavoritesSection";
import { QuickActions } from "./_components/QuickActions";

// Mock subscription data
const mockSubscription = {
  planName: "PRO+",
  durationMonths: 3,
  daysLeft: 48,
};

export default function Hero() {
  const { data: session, isPending, error } = useSession();
  const locale = useLocale();

  // 🌀 Loading state
  if (isPending) {
    return (
      <div className="h-[40dvh] flex items-center justify-center">
        <Loader2 className="animate-spin text-black" />
      </div>
    );
  }

  // 🚫 Error or no session = redirect
  if (!session || error) {
    redirect({ href: "/", locale });
  }

  if (!session) throw new Error("Session should be defined here");

  const handleUserUpdate = () => {
  };

  return (
    <div className="mx-auto max-w-7xl sm:px-8 px-4 py-8 font-sf">
      <WelcomeSection firstName={session.user.name} />

      <SubscriptionSection
        planName={mockSubscription.planName}
        durationMonths={mockSubscription.durationMonths}
        daysLeft={mockSubscription.daysLeft}
      />

      <div className=" gap-6">
        <div className="">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 sm:gap-3 gap-0 h-16">
              <TabsTrigger
                value="personal"
                className="data-[state=active]:bg-primary-blue cursor-pointer flex h-14 data-[state=active]:text-white sm:text-xl"
              >
                <Link
                  href={"/settings?tab=personal"}
                  className="w-full h-full flex items-center justify-center"
                >
                  <span>Personal</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="jobs"
                className="data-[state=active]:bg-primary-blue cursor-pointer flex h-14 data-[state=active]:text-white sm:text-xl"
              >
                <Link
                  href={"/settings?tab=jobs"}
                  className="w-full h-full flex items-center justify-center"
                >
                  <span>Jobs</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="resume"
                className="data-[state=active]:bg-primary-blue cursor-pointer flex h-14 data-[state=active]:text-white sm:text-xl"
              >
                <Link
                  href={"/settings?tab=resume"}
                  className="w-full h-full flex items-center justify-center"
                >
                  <span>Resume</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="quick-actions"
                className="data-[state=active]:bg-primary-blue cursor-pointer flex h-14 data-[state=active]:text-white sm:text-xl"
              >
                <Link
                  href={"/settings?tab=quickactions"}
                  className="w-full h-full flex items-center justify-center"
                >
                  <span>Quick Actions</span>
                </Link>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <PersonalInfoSection
                user={{
                  email: session.user.email,
                  first_name: session.user.name.split(" ")[0],
                  last_name: session.user.name.split(" ")[1],
                  phone: "Not Yet"
                }}
                onUpdate={handleUserUpdate} />
            </TabsContent>

            <TabsContent value="jobs">
              <FavoritesSection />
            </TabsContent>

            <TabsContent value="resume">
              <ResumeSection />
            </TabsContent>

            <TabsContent value="quick-actions">
              <QuickActions />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          {/* Additional sidebar content can go here if needed */}
        </div>
      </div>
    </div>
  );
}
