"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Trash2,
  Search,
  MapPin,
  Building,
  DollarSign,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { SubscriptionPlan } from "@prisma/client";
import {
  getFavorites,
  removeFromFavorites,
  FavoriteJob,
} from "@/lib/favorites";
import { getTranslation } from "@/lib/utils";
import { checkFavoriteLimit } from "@/lib/subscription-utils";
import { useRouter } from "next/navigation";

export function FavoritesSection() {
  const router = useRouter();
  const t = useTranslations("favorites");
  const tCommon = useTranslations("common");
  const locale = useLocale() || "en";
  const [favorites, setFavorites] = useState<FavoriteJob[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteJob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    canAdd: boolean;
    limit: number;
    current: number;
    plan: SubscriptionPlan;
  }>({
    canAdd: true,
    limit: 0,
    current: 0,
    plan: SubscriptionPlan.NONE,
  });

  const searchPlaceholder = "Search your saved jobs...";

  const fetchData = async () => {
    try {
      const [favoritesData] = await Promise.all([getFavorites()]);

      setFavorites(favoritesData);
      setFilteredFavorites(favoritesData);

      try {
        const response = await fetch("/api/subscription/me");
        const session = await response.json();
        if (session?.data?.plan) {
          const limitInfo = await checkFavoriteLimit(session.data.plan);
          setSubscriptionInfo({
            ...limitInfo,
            plan: session.data.plan as SubscriptionPlan,
          });
        }
      } catch (error) {
        console.error("Error fetching subscription info:", error);
        toast.error(t("error.fetchingFavorites"));
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error(t("error.fetchingFavorites"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [t]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFavorites(favorites);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = favorites.filter((favorite) => {
      const translation = getTranslation(
        favorite.job.translations,
        locale,
        "en"
      );
      if (!translation) return false;

      return (
        (translation.title || "").toLowerCase().includes(searchLower) ||
        (translation.company || "").toLowerCase().includes(searchLower) ||
        (translation.location || "").toLowerCase().includes(searchLower) ||
        (translation.jobType || "").toLowerCase().includes(searchLower) ||
        (translation.season || "").toLowerCase().includes(searchLower)
      );
    });

    setFilteredFavorites(filtered);
  }, [searchTerm, favorites, locale]);

  const handleRemoveFavorite = async (favoriteId: string) => {
    if (
      !confirm("Are you sure you want to remove this job from your favorites?")
    )
      return;

    try {
      const result = await removeFromFavorites(favoriteId);
      if (result.success) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.id !== favoriteId)
        );
        setFilteredFavorites((prev) =>
          prev.filter((fav) => fav.id !== favoriteId)
        );
        toast.success(t("removedFromFavorites"));
        fetchData();
      } else {
        throw new Error(result.error || "Failed to remove favorite");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error(t("error.removingFavorite"));
    }
  };

  const viewJobDetails = (job: FavoriteJob) => {
    const tr = getTranslation(job.job.translations, locale, "en");
    router.push(`/?q=${tr?.title}`);
  };

  const formatSalary = (salary?: string) => {
    if (!salary) return tCommon("salaryNotSpecified");
    return salary;
  };

  const formatDate = (dateInput: string | Date) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getPlanName = (plan: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.NONE:
        return "Free Trial";
      case SubscriptionPlan.FREE:
        return "Free";
      case SubscriptionPlan.BASIC:
        return "Basic";
      case SubscriptionPlan.PRO:
        return "Pro";
      case SubscriptionPlan.PRO_PLUS:
        return "Pro+";
      default:
        return "Free";
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
            <CardDescription className="mt-2">
              {t("savedJobs")}: {favorites.length}
              {subscriptionInfo.limit > 0 ? ` / ${subscriptionInfo.limit}` : ""}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {getPlanName(subscriptionInfo.plan)}
          </Badge>
        </div>

        {subscriptionInfo.limit > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t("storageUsage")}</span>
              <span>
                {subscriptionInfo.current} / {subscriptionInfo.limit}{" "}
                {t("jobs")} (
                {Math.round(
                  (subscriptionInfo.current / subscriptionInfo.limit) * 100
                )}
                %)
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full ${
                  subscriptionInfo.current >= subscriptionInfo.limit * 0.9
                    ? "bg-red-500"
                    : "bg-primary"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    (subscriptionInfo.current / subscriptionInfo.limit) * 100
                  )}%`,
                  transition: "width 0.3s ease-in-out",
                }}
              />
            </div>
            {!subscriptionInfo.canAdd && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
                <AlertTriangle className="h-4 w-4" />
                <span>{t("upgradeMessage")}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
            disabled={isLoading || favorites.length === 0}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-lg">
              {favorites.length === 0 ? t("emptyState") : t("noResults")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFavorites.map((favorite) => {
              const tr = getTranslation(
                favorite.job.translations,
                locale,
                "en"
              );
              if (!tr) return null;

              return (
                <div
                  key={favorite.id}
                  className="border relative rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between flex-wrap items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-2xl mb-3">
                        {tr.title || tCommon("noTitle")}
                      </h3>
                      <div className="flex items-center gap-4 text-base text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Building className="size-6" />
                          {tr.company || tCommon("noCompany")}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="size-6" />
                          {tr.location || tCommon("noLocation")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-base">
                          {tr.jobType || tCommon("noJobType")}
                        </Badge>
                        <div className="flex items-center gap-1 text-base text-muted-foreground">
                          <DollarSign className="size-6" />
                          {formatSalary(tr.salary)}
                        </div>
                      </div>
                      <p className="text-base text-muted-foreground">
                        {t("addedOn")} {formatDate(favorite.createdAt)}
                      </p>
                    </div>
                  </div>
                  {tr.requirements && (
                    <p className="text-base text-muted-foreground line-clamp-2">
                      {tr.requirements}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap md:ml-4 max-md:mt-5 md:absolute top-3 right-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-base"
                      onClick={() => viewJobDetails(favorite)}
                    >
                      <Eye className="size-6 mr-2" />
                      {t("viewDetails")}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-base"
                      onClick={() => handleRemoveFavorite(favorite.jobId)}
                    >
                      <Trash2 className="size-6 mr-2" />
                      {t("remove")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
