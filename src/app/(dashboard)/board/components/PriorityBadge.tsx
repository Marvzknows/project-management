import { Badge } from "@/components/ui/badge";
import { formatText } from "@/lib/utils";
import React from "react";

export type Priority =
  | "NONE"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "VERY HIGH"
  | "URGENT";

interface PriorityBadgeProps {
  priority: Priority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  // Solid dark-theme color palette (no gradients)
  const colorMap: Record<Priority, string> = {
    NONE: "bg-zinc-700 text-zinc-300 border border-zinc-600",
    LOW: "bg-emerald-600 text-white border border-emerald-400/50",
    MEDIUM: "bg-amber-500 text-black border border-amber-400/50",
    HIGH: "bg-orange-600 text-white border border-orange-400/50",
    "VERY HIGH": "bg-red-600 text-white border border-red-400/50",
    URGENT: "bg-rose-700 text-white border border-rose-400/50 ",
  };

  return (
    <Badge
      className={`${colorMap[priority]} text-xs font-medium rounded-sm px-2 py-0.5 leading-tight`}
    >
      {formatText(priority)}
    </Badge>
  );
};

export default PriorityBadge;
