import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface WelcomeSectionProps {
  firstName: string;
}

export function WelcomeSection({ firstName }: WelcomeSectionProps) {
  const t = useTranslations("WelcomeSection");

  return (
    <Card className="mb-6 w-full shadow-none border-0">
      <CardContent className="pt-6 text-center">
        <h2 className="md:text-[40px] sm:text-[32px] text-[26px] font-bold leading-[1.1] mb-6">
          {t("greeting", { firstName })}
        </h2>
        <p className="text-2xl text-center text-muted-foreground mt-2">
          👋 {t("welcomeMessage")}
        </p>
      </CardContent>
    </Card>
  );
}
