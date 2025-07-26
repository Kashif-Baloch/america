"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoSection } from "./_components/PersonalInfoSection";
import { ResumeSection } from "./_components/ResumeSection";
import { SubscriptionSection } from "./_components/SubscriptionSection";
import { WelcomeSection } from "./_components/WelcomeSection";

import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { useSession } from "@/lib/auth-client";
import { LogoutUser } from "@/utils/handle-logout";
import { CreditCard, Loader2, LogOut, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { FavoritesSection } from "./_components/FavoritesSection";

// Mock subscription data
const mockSubscription = {
  planName: "PRO+",
  durationMonths: 3,
  daysLeft: 48,
};

export default function Hero() {
  const { data: session, isPending, error } = useSession();
  const router = useRouter()
  const tQ = useTranslations("QuickActions");

  if (isPending) {
    return (
      <div className="h-[100dvh] flex items-center justify-center">
        <Loader2 className="animate-spin text-black" />
      </div>
    );
  }

  // 🚫 Error or no session = redirect
  if (!session || error) {
    router.push("/");
  }

  const handleUserUpdate = () => {
  };

  const handleAction = async (actionKey: string) => {
    if (actionKey === "logOut") {
      await LogoutUser({
        onSuccess: () => {
          toast.success(
            tQ("successMessage", { action: tQ(`actions.${actionKey}.label`) })
          );

        }
      })
    }
  };

  return (
    <>
      {
        session ?
          <div className="mx-auto max-w-7xl sm:px-8 px-4 py-8 font-sf">
            <WelcomeSection firstName={session.user.name} />
            <pre className="text-base overflow-clip mb-4">
              {JSON.stringify(session, null, 2)}
            </pre>
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
                        role: session.user.role,
                        name: session.user.name,
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
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          <h2 className="md:text-[40px] sm:text-[32px] text-[26px] font-bold leading-[1.2] mb-6">
                            {tQ("title")}
                          </h2>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          className="w-full justify-start bg-transparent text-lg h-14 cursor-pointer"
                          variant="outline"
                        >
                          <Link href={"/"} className="flex gap-2">
                            <Search className="size-6 mr-2" />
                            {tQ("actions.browseJobs.label")}
                          </Link>
                        </Button>
                        <Button
                          className="w-full justify-start bg-transparent text-lg h-14 cursor-pointer"
                          variant="outline"
                          onClick={() => handleAction("browseJobs")}
                        >
                          <CreditCard className="size-6 mr-2" />
                          {tQ("actions.upgradePlan.label")}
                        </Button>
                        <Button
                          className="w-full justify-start bg-transparent text-lg h-14 cursor-pointer"
                          variant="outline"
                          onClick={() => handleAction("logOut")}
                        >
                          <LogOut className="size-6 mr-2" />
                          {tQ("actions.logOut.label")}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="lg:col-span-1">
                {/* Additional sidebar content can go here if needed */}
              </div>
            </div>
          </div>
          :
          <div className="h-[100dvh] flex items-center justify-center">
            <Loader2 className="animate-spin text-black" />
          </div>
      }
    </>
  );
}
