"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@myapp/ui/components/badge";
import { AlertTriangle, ArrowUp, Minus, ArrowDown } from "lucide-react";
import type { TicketPriority } from "@myapp/prisma";

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
}

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  const t = useTranslations("InboxPage.priority");

  const getPriorityConfig = (priority: TicketPriority) => {
    switch (priority) {
      case "URGENT":
        return {
          label: t("urgent"),
          variant: "destructive" as const,
          icon: AlertTriangle,
          className: "bg-red-500 text-white hover:bg-red-500",
        };
      case "HIGH":
        return {
          label: t("high"),
          variant: "secondary" as const,
          icon: ArrowUp,
          className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
        };
      case "NORMAL":
        return {
          label: t("normal"),
          variant: "outline" as const,
          icon: Minus,
          className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
        };
      case "LOW":
        return {
          label: t("low"),
          variant: "secondary" as const,
          icon: ArrowDown,
          className: "bg-green-100 text-green-800 hover:bg-green-100",
        };
      default:
        return {
          label: priority,
          variant: "outline" as const,
          icon: Minus,
          className: "",
        };
    }
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.className} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
