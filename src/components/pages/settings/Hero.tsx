"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WelcomeSection } from "./_components/WelcomeSection";
import { SubscriptionSection } from "./_components/SubscriptionSection";
import { PersonalInfoSection } from "./_components/PersonalInfoSection";
import { ResumeSection } from "./_components/ResumeSection";

import { QuickActions } from "./_components/QuickActions";
import { FavoritesSection } from "./_components/FavoritesSection";
import { Link } from "@/i18n/navigation";

// Mock user data
const mockUser = {
  id: "1",
  first_name: "Carlos",
  last_name: "Rodriguez",
  email: "carlos.rodriguez@email.com",
  phone: "+1 (555) 123-4567",
};

// Mock subscription data
const mockSubscription = {
  planName: "PRO+",
  durationMonths: 3,
  daysLeft: 48,
};

type User = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
};

export default function Hero() {
  const [user, setUser] = useState(mockUser);

  const handleUserUpdate = (updatedUser: User) => {
    setUser({ ...user, ...updatedUser });
  };

  return (
    <div className="mx-auto max-w-7xl sm:px-8 px-4 py-8 font-sf">
      <WelcomeSection firstName={user.first_name} />

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
              <PersonalInfoSection user={user} onUpdate={handleUserUpdate} />
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
