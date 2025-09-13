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
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-[#7B7B7B]">{label}</span>
      <Badge
        variant="secondary"
        className={`lg:text-[17px] text-right text-sm px-3 rounded whitespace-break-spaces overflow-auto min-w-[110px] md:max-w-[150px] ${
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
