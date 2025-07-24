import { Badge } from "@/components/ui/badge";

export default function DetailRow({
  label,
  value,
  valueType,
}: {
  label: string;
  value: string;
  valueType: "basic" | "pro";
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-[#7B7B7B]">{label}</span>
      <Badge
        variant="secondary"
        className={`lg:text-[17px] text-sm px-3 rounded ${
          valueType === "basic"
            ? "bg-ghost-green text-secondary-green"
            : "bg-ghost-golden text-golden"
        }`}
      >
        {value}
      </Badge>
    </div>
  );
}
