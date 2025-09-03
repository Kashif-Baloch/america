"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoSection } from "./_components/PersonalInfoSection";
import { ResumeSection } from "./_components/ResumeSection";
import { SubscriptionSection } from "./_components/SubscriptionSection";
import { WelcomeSection } from "./_components/WelcomeSection";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, useRouter } from "@/i18n/navigation";
import { updateUser, useSession } from "@/lib/auth-client";
import { LogoutUser } from "@/utils/handle-logout";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle,
  CreditCard,
  Loader2,
  LogOut,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { FavoritesSection } from "./_components/FavoritesSection";
// import { useSubscriptionMeDetails } from "@/lib/subscription-queries";

// Subscription data is now handled by the useSubscription hook in SubscriptionSection

export default function Hero() {
  const { data: session, isPending, error } = useSession();
  // const { data: subscription, isPending: SubIsPending, error: SubError } = useSubscriptionMeDetails()
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancellationReasons, setCancellationReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");
  const router = useRouter();
  const tQ = useTranslations("QuickActions");
  const t = useTranslations("PersonalInfoSection");
  const tSub = useTranslations("SubscriptionSection");
  const tdia = useTranslations("DialogSub");

  const cancellationOptions = [
    tSub("cancellationOptions.noTime"),
    tSub("cancellationOptions.tooExpensive"),
    tSub("cancellationOptions.foundAlternative"),
    tSub("cancellationOptions.noMatchingJobs"),
    tSub("cancellationOptions.confusing"),
  ];

  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      setCancellationReasons([...cancellationReasons, option]);
    } else {
      setCancellationReasons(
        cancellationReasons.filter((item) => item !== option)
      );
    }
  };

  const [isCancelling, setIsCancelling] = useState(false);

  const handleSubmitCancellation = async () => {
    try {
      setIsCancelling(true);
      const allReasons = otherReason
        ? [...cancellationReasons, `${tSub("other")}: ${otherReason}`]
        : cancellationReasons;

      // Log cancellation reasons (you might want to send this to your analytics)
      console.log("Cancellation reasons:", allReasons);

      // Call the update subscription API
      const response = await fetch("/api/subscription/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel subscription");
      }

      // Show success message
      toast.success(tSub("cancellationSuccess"));

      // Reset form
      setShowCancelForm(false);
      setCancellationReasons([]);
      setOtherReason("");

      // Refresh the page to show updated subscription status
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error(
        error instanceof Error ? error.message : tSub("cancellationError")
      );
    } finally {
      setIsCancelling(false);
    }
  };

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

  const handleUserUpdate = async (data: {
    name: string;
    phone?: string;
    resumeLink?: string;
  }) => {
    try {
      setIsUpdatePending(true);

      console.log(data);
      await updateUser({
        name: data?.name || session?.user.name,
        phone: data?.phone,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success(t("successMessage"));
          },
        },
      });
      console.log("Refreshing router...");

      // window.location.reload();
      setIsUpdatePending(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAction = async (action: string) => {
    switch (action) {
      case "browseJobs":
        router.push("/");
        break;
      case "upgradePlan":
        setShowUpgradeDialog(true);
        break;
      case "confirmUpgrade":
        router.push("/pricing");
        setShowUpgradeDialog(false);
        break;
      case "cancelSubscription":
        setShowCancelForm(true);
        break;
      case "logOut":
        LogoutUser({ onSuccess: () => router.push("/") });
        break;
      default:
        break;
    }
  };

  return (
    <>
      {session ? (
        <div className="mx-auto max-w-7xl sm:px-8 px-4 py-8 font-sf">
          <WelcomeSection firstName={session.user.name} />
          {/* <pre className="text-base overflow-clip mb-4">
              {JSON.stringify(session, null, 2)}
            </pre> */}
          <SubscriptionSection onUpgrade={() => handleAction("upgradePlan")} />

          {/* Upgrade Plan Dialog */}
          <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{tdia("title")}</DialogTitle>
                <DialogDescription>{tdia("description")}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowUpgradeDialog(false)}
                >
                  {tdia("cancelButton")}
                </Button>
                <Button
                  onClick={() => handleAction("confirmUpgrade")}
                  className="bg-golden hover:bg-golden/90"
                >
                  {tdia("confirmButton")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="gap-6">
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

                <TabsContent value="personal" className="space-y-6 relative">
                  {isUpdatePending && (
                    <div className="w-full h-full absolute top-0 left-0 flex gap-2 items-center justify-center flex-col bg-white/80">
                      <Loader2 className="animate-spin" />
                      <p>Updating user..</p>
                    </div>
                  )}
                  <PersonalInfoSection
                    user={{
                      email: session.user.email,
                      role: session.user.role,
                      name: session.user.name,
                      phone: session.user.phone,
                    }}
                    onUpdate={handleUserUpdate}
                  />
                </TabsContent>

                <TabsContent value="jobs">
                  <FavoritesSection />
                </TabsContent>

                <TabsContent value="resume">
                  <ResumeSection
                    resumeLink={session?.user?.resumeLink}
                    name={session.user.name}
                    phone={session.user.phone}
                  />
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
                        onClick={() => handleAction("upgradePlan")}
                      >
                        <CreditCard className="size-6 mr-2" />
                        {tQ("actions.upgradePlan.label")}
                      </Button>

                      <Button
                        className="w-full justify-start bg-transparent text-lg h-14 cursor-pointer"
                        variant="outline"
                        onClick={() => handleAction("cancelSubscription")}
                      >
                        <AlertTriangle className="size-6 mr-2 text-red-500" />
                        {tQ("actions.cancelSubscription.label")}
                      </Button>

                      <Button
                        className="w-full justify-start bg-transparent text-lg h-14 cursor-pointer"
                        variant="outline"
                        onClick={() => handleAction("logOut")}
                      >
                        <LogOut className="size-6 mr-2" />
                        {tQ("actions.logOut.label")}
                      </Button>

                      {/* Cancel Subscription Dialog */}
                      <Dialog
                        open={showCancelForm}
                        onOpenChange={setShowCancelForm}
                      >
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="text-red-500" />
                              {tSub("cancelTitle")}
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                              {tSub("cancelDescription")}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <p className="text-sm text-gray-600">
                              {tSub("cancellationOptions.prompt")}
                            </p>
                            <div className="space-y-3">
                              {cancellationOptions.map((option) => (
                                <div
                                  key={option}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={option}
                                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={cancellationReasons.includes(
                                      option
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleCheckboxChange(
                                        option,
                                        checked as boolean
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={option}
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    {option}
                                  </label>
                                </div>
                              ))}

                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="other"
                                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                  checked={cancellationReasons.includes(
                                    tSub("other")
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange(
                                      tSub("other"),
                                      checked as boolean
                                    )
                                  }
                                />
                                <label
                                  htmlFor="other"
                                  className="text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                  {tSub("other")}:
                                </label>
                              </div>

                              {cancellationReasons.includes(tSub("other")) && (
                                <div className="pl-7">
                                  <input
                                    type="text"
                                    value={otherReason}
                                    onChange={(e) =>
                                      setOtherReason(e.target.value)
                                    }
                                    placeholder={tSub("otherPlaceholder")}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 border"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <DialogFooter className="mt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowCancelForm(false);
                                setCancellationReasons([]);
                                setOtherReason("");
                              }}
                            >
                              {tSub("backButton")}
                            </Button>
                            <Button
                              onClick={handleSubmitCancellation}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={
                                cancellationReasons.length === 0 ||
                                (cancellationReasons.includes(tSub("other")) &&
                                  !otherReason.trim())
                              }
                            >
                              {isCancelling
                                ? "Cancelling Subscription"
                                : tSub("confirmButton")}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
      ) : (
        <div className="h-[100dvh] flex items-center justify-center">
          <Loader2 className="animate-spin text-black" />
        </div>
      )}
    </>
  );
}
