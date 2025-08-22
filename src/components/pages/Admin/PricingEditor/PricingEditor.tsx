"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import useClickOutsideDetector from "@/hooks/useClickOutsideDetector";

interface PricingPlan {
  type: string;
  name: string;
  description: string;
  monthlyPrice: string;
  quarterlyPrice: string;
  monthlyUsdPrice: string;
  quarterlyUsdPrice: string;
  buttonText: string;
  highlighted?: boolean;
  features: string[];
}

interface PricingPlanEditorProps {
  initialPlans: PricingPlan[];
  onSave: (plans: PricingPlan[]) => void;
  loading?: boolean;
  languages: { code: string; name: string }[];
}

export function PricingPlanEditor({
  initialPlans,
  onSave,
  loading,
  languages,
}: PricingPlanEditorProps) {
  const t = useTranslations("PricingPlanEditor");
  const [plans, setPlans] = useState<PricingPlan[]>(initialPlans);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0].code);
  const [newFeature, setNewFeature] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutsideDetector(ref, () => {
    setOpen(false);
  });

  const handleSave = async () => {
    onSave(plans);
  };

  const handleEditPlan = (plan: PricingPlan) => {
    setEditingPlan(JSON.parse(JSON.stringify(plan)));
  };

  const handleUpdatePlan = () => {
    if (!editingPlan) return;

    setPlans(
      plans.map((plan) => (plan.type === editingPlan.type ? editingPlan : plan))
    );
    setEditingPlan(null);
    toast.success(t("success.update", { plan: editingPlan.name }));
  };

  const handleAddFeature = () => {
    if (!editingPlan || !newFeature.trim()) return;

    setEditingPlan({
      ...editingPlan,
      features: [...editingPlan.features, newFeature.trim()],
    });
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingPlan) return;

    setEditingPlan({
      ...editingPlan,
      features: editingPlan.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h2 className="md:text-[40px] sm:text-[32px] text-[26px] font-bold leading-[1.2] mb-6">
        {t("title")}
      </h2>

      <div className="flex justify-end mb-6">
        <div className="relative w-[180px]" ref={ref}>
          <button
            className="w-full border border-gray-300 cursor-pointer px-3 py-2 rounded bg-white text-left"
            onClick={() => setOpen((prev) => !prev)}
          >
            {languages.find((lang) => lang.code === currentLanguage)?.name ||
              t("selectLanguage")}
          </button>

          {open && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow">
              {languages.map((lang) => (
                <li
                  key={lang.code}
                  onClick={() => {
                    setCurrentLanguage(lang.code);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    lang.code === currentLanguage ? "bg-gray-100" : ""
                  }`}
                >
                  {lang.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Editor Section */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{t("editPlans.title")}</CardTitle>
              <CardDescription className="text-base">
                {t("editPlans.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base">
                      {t("tableHeaders.plan")}
                    </TableHead>
                    <TableHead className="text-base">
                      {t("tableHeaders.monthlyPrice")}
                    </TableHead>
                    <TableHead className="text-base">
                      {t("tableHeaders.quarterlyPrice")}
                    </TableHead>
                    <TableHead className="text-base">
                      {t("tableHeaders.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.type}>
                      <TableCell className="font-medium text-base">
                        {plan.name}
                      </TableCell>
                      <TableCell className="text-base">
                        {plan.monthlyPrice}
                      </TableCell>
                      <TableCell className="text-base">
                        {plan.quarterlyPrice}
                      </TableCell>
                      <TableCell className="text-base">
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => handleEditPlan(plan)}
                        >
                          {t("buttons.edit")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex gap-4 mt-6">
                <Button
                  disabled={loading}
                  className="text-base h-12 w-40"
                  onClick={handleSave}
                >
                  {loading ? "Saving..." : t("buttons.saveChanges")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          {editingPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {t("editForm.title", { plan: editingPlan.name })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base">{t("editForm.planName")}</Label>
                  <Input
                    className="h-14 !text-base placeholder:text-base"
                    value={editingPlan.name}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">
                    {t("editForm.description")}
                  </Label>
                  <Textarea
                    value={editingPlan.description}
                    className="!text-base placeholder:text-base"
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base">
                      {t("editForm.monthlyPrice")}
                    </Label>
                    <Input
                      value={editingPlan.monthlyPrice}
                      className="h-14 !text-base placeholder:text-base"
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          monthlyPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">
                      {t("editForm.quarterlyPrice")}
                    </Label>
                    <Input
                      value={editingPlan.quarterlyPrice}
                      className="h-14 !text-base placeholder:text-base"
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          quarterlyPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base">
                      {t("editForm.monthlyUsdPrice")}
                    </Label>
                    <Input
                      value={editingPlan.monthlyUsdPrice}
                      className="h-14 !text-base placeholder:text-base"
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          monthlyUsdPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">
                      {t("editForm.quarterlyUsdPrice")}
                    </Label>
                    <Input
                      value={editingPlan.quarterlyUsdPrice}
                      className="h-14 !text-base placeholder:text-base"
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          quarterlyUsdPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">
                    {t("editForm.buttonText")}
                  </Label>
                  <Input
                    className="h-14 !text-base placeholder:text-base"
                    value={editingPlan.buttonText}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        buttonText: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">
                    {t("editForm.highlighted")}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="highlighted"
                      checked={editingPlan.highlighted || false}
                      onCheckedChange={(checked) =>
                        setEditingPlan({
                          ...editingPlan,
                          highlighted: checked,
                        })
                      }
                    />
                    <Label htmlFor="highlighted">
                      {editingPlan.highlighted ? t("yes") : t("no")}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">{t("editForm.features")}</Label>
                  <div className="space-y-2">
                    {editingPlan.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span>{feature}</span>
                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          {t("buttons.remove")}
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center mt-7">
                    <Input
                      value={newFeature}
                      className="h-14 !text-base placeholder:text-base"
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder={t("editForm.newFeaturePlaceholder")}
                    />
                    <Button onClick={handleAddFeature} className="h-14">
                      {t("buttons.addFeature")}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="h-12"
                    onClick={() => setEditingPlan(null)}
                  >
                    {t("buttons.cancel")}
                  </Button>
                  <Button className="h-12" onClick={handleUpdatePlan}>
                    {t("buttons.savePlan")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview Section - Commented out but preserved */}
        {/* <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Preview</CardTitle>
              <CardDescription className="text-base">
                This is how your pricing plans will look to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 justify-center items-center mb-6">
                <Label className={`${!isQuarterly ? "text-primary-blue" : "text-gray-500"} text-lg font-medium`}>
                  Monthly
                </Label>
                <Switch
                  checked={isQuarterly}
                  onCheckedChange={setIsQuarterly}
                  className="data-[state=checked]:bg-primary-blue cursor-pointer"
                />
                <Label className={`${isQuarterly ? "text-primary-blue" : "text-gray-500"} text-lg font-medium`}>
                  Quarterly
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan, index) => (
                  <Card
                    key={plan.type}
                    className={`relative min-h-[650px] rounded-[39px] ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-[#CB9442] to-[#FEDC6E] text-white"
                        : "bg-white border-gray-200"
                    } ${index === 0 ? "border-[#DADADA]" : ""}`}
                  >
                    <CardHeader className="text-center">
                      <CardTitle className={`text-2xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                        {plan.name === "Free" ? (
                          <span className="invisible">Free</span>
                        ) : (
                          plan.name
                        )}
                      </CardTitle>
                      <div className="mt-4">
                        {plan.name === "Free" ? (
                          <div className="sm:text-[32px] text-2xl font-bold text-left leading-[1.2]">
                            Free
                          </div>
                        ) : (
                          <>
                            <h3
                              className={`sm:text-[31px] text-2xl font-bold leading-[1.2] text-left ${
                                plan.highlighted ? "text-white" : "text-black"
                              }`}
                            >
                              {isQuarterly ? plan.quarterlyPrice : plan.monthlyPrice}
                              <span className="text-lg font-normal">/month</span>
                            </h3>
                            <div
                              className={`text-sm text-left ${
                                plan.highlighted ? "text-white/90" : "text-[#222222]"
                              } mt-1`}
                            >
                              {isQuarterly ? plan.quarterlyUsdPrice : plan.monthlyUsdPrice}
                            </div>
                          </>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 flex flex-col justify-between h-[90%]">
                      <CardDescription
                        className={`text-left text-lg mb-4 ${
                          plan.highlighted ? "text-white/90" : "text-light-black"
                        }`}
                      >
                        {plan.description}

                        <ul className="space-y-3 mt-4 mb-8">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <GoCheckCircleFill
                                className={`size-6 mt-0.5 flex-shrink-0 ${
                                  plan.highlighted ? "text-white" : "text-[#858C95]"
                                }`}
                              />
                              <span
                                className={`text-[17px] ${
                                  plan.highlighted ? "text-white" : "text-light-black"
                                }`}
                              >
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardDescription>

                      <Button
                        className={`w-11/12 rounded-full absolute bottom-6 left-1/2 -translate-x-1/2 duration-300 flex text-[17px] font-bold cursor-pointer h-16 ${
                          plan.highlighted
                            ? "bg-white text-black hover:bg-black hover:text-white"
                            : "bg-primary-blue blue-btn-shadow text-white hover:bg-white hover:text-primary-blue border border-primary-blue"
                        }`}
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
}
