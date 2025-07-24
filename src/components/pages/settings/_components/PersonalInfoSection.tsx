"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface PersonalInfoSectionProps {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  onUpdate: (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  }) => void;
}

export function PersonalInfoSection({
  user,
  onUpdate,
}: PersonalInfoSectionProps) {
  const t = useTranslations("PersonalInfoSection");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone || "",
  });

  const handleSave = () => {
    onUpdate({ ...user, ...formData });
    setIsEditing(false);
    toast.success(t("successMessage"));
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || "",
    });
    setIsEditing(false);
  };

  return (
    <Card className="mb-6 shadow-none">
      <CardHeader className="flex sm:flex-row flex-col gap-y-3 items-center justify-between">
        <CardTitle>
          <h2 className="md:text-[40px] sm:text-[32px] text-[26px] font-bold leading-[1.2] mb-6">
            {t("title")}
          </h2>
        </CardTitle>
        {!isEditing ? (
          <Button
            variant="outline"
            size="lg"
            className="text-base cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="size-6 mr-2" />
            {t("editButton")}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              className="text-base cursor-pointer"
              onClick={handleCancel}
            >
              <X className="size-6 mr-2" />
              {t("cancelButton")}
            </Button>
            <Button
              size="lg"
              className="text-base cursor-pointer"
              onClick={handleSave}
            >
              <Save className="size-6 mr-2" />
              {t("saveButton")}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xl font-normal" htmlFor="first_name">
              {t("firstNameLabel")}
            </Label>
            {isEditing ? (
              <Input
                className={`${isEditing ? "" : ""} !text-lg py-7`}
                id="first_name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            ) : (
              <p className="text-lg py-2">{user.first_name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-xl font-normal" htmlFor="last_name">
              {t("lastNameLabel")}
            </Label>
            {isEditing ? (
              <Input
                className={`${isEditing ? "" : ""} !text-lg py-7`}
                id="last_name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            ) : (
              <p className="text-lg py-2">{user.last_name}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xl font-normal" htmlFor="email">
            {t("emailLabel")}
          </Label>
          <p className="text-lg py-2 text-muted-foreground">{user.email}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-xl font-normal" htmlFor="phone">
            {t("phoneLabel")}
          </Label>
          {isEditing ? (
            <Input
              className={`${isEditing ? "" : ""} !text-lg py-7`}
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder={t("phonePlaceholder")}
            />
          ) : (
            <p className="text-lg py-2">{user.phone || t("notProvided")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
