import { Lock } from "lucide-react";
import { Button } from "./button";

export function LockedFeatureOverlay({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] rounded-md flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-white/80 hover:bg-white transition-all"
        onClick={onClick}
        aria-label="Unlock feature"
      >
        <Lock className="h-5 w-5 text-gray-600" />
      </Button>
    </div>
  );
}
