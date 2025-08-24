import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { BsFillBookmarkFill, BsBookmark } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useLocale, useTranslations } from "next-intl";
import { JobWithTranslations, Plan } from "@/lib/types";
import { getTranslation, ratingToNumber } from "@/lib/utils";
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} from "@/lib/favorites";

type FavoriteToggleHandler = (
  jobId: string,
  isFavorite: boolean,
  favoriteId?: string
) => void;

interface JobCardProps {
  job: JobWithTranslations;
  plan: Plan;
  selectedCard?: string | null;
  setSelectedCard?: (id: string | null) => void;
  onFavoriteToggle?: FavoriteToggleHandler;
  favoriteId?: string;
  isFavorite?: boolean;
}

export function JobCard({
  job,
  plan,
  selectedCard,
  setSelectedCard = () => {},
  onFavoriteToggle,
  favoriteId,
  isFavorite: isFavoriteProp = false,
}: JobCardProps) {
  const t = useTranslations("home");
  const locale = useLocale();
  const tr = getTranslation(job.translations, locale, "en");
  const [isFav, setIsFav] = useState(isFavoriteProp);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkFavorite = async () => {
      if (plan === "NONE") return;
      try {
        const favStatus = await isFavorite(job.id);
        setIsFav(favStatus);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    checkFavorite();
  }, [job.id, plan]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    setIsLoading(true);
    try {
      if (isFav) {
        await removeFromFavorites(favoriteId || job.id);
        onFavoriteToggle?.(job.id, false);
        setIsFav(false);
      } else {
        const result = await addToFavorites(job.id);
        if (result.success) {
          onFavoriteToggle?.(job.id, true, result.favorite?.id);
          setIsFav(true);
        } else if (result.requiresUpgrade) {
          toast.error(
            "You've reached your saved jobs limit for your current plan.",
            {
              duration: 5000,
            }
          );
          return;
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!tr) return null;

  return (
    <Card
      onClick={() => setSelectedCard(job.id)}
      className={`border ${
        selectedCard === job.id ? "border-primary-blue" : "border-[#DADADA]"
      } rounded-2xl lg:h-[342px] lg:w-[458px] cursor-pointer w-full`}
    >
      <CardContent className="p-4 relative">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold font-roboto sm:text-3xl text-2xl leading-[1.1] w-11/12">
            {tr.title}
          </h3>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-gray-100 transition-colors group"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-500"></div>
            ) : isFav ? (
              <BsFillBookmarkFill className="h-5 w-5 text-yellow-500" />
            ) : (
              <BsBookmark className="h-5 w-5 text-gray-400 group-hover:text-yellow-500 transition-colors" />
            )}
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {(plan === "BASIC" || plan === "PRO" || plan === "PRO_PLUS") && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{t("job.detail.company")}</span>
              <Badge
                variant="secondary"
                className="lg:text-[17px] text-sm px-3 text-secondary-green bg-ghost-green"
              >
                {tr.company}
              </Badge>
            </div>
          )}

          <div className="text-2xl font-semibold">{tr.salary}</div>

          {(plan === "PRO" || plan === "PRO_PLUS") && (
            <div className="">Location:- {tr.location}</div>
          )}

          {(plan === "PRO" || plan === "PRO_PLUS") && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#7B7B7B]">
                  {t("job.detail.hiresOutside")}
                </span>
                <Badge
                  variant="secondary"
                  className="bg-ghost-golden capitalize px-3 text-golden lg:text-lg text-sm"
                >
                  {tr.hiresOutside}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 ">
            <span className="text-sm text-gray-600">
              {t("job.rating.label")}
            </span>
            <div className="flex items-center gap-1">
              <FaStar className="fill-primary-yellow text-2xl" />
              <span className="font-roboto">
                {ratingToNumber(tr.rating).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
