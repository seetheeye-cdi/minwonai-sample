"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@myapp/ui/components/badge";
import type { TicketStatus } from "@myapp/prisma";

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const t = useTranslations("InboxPage.status");

  const getStatusConfig = (status: TicketStatus) => {
    switch (status) {
      case "NEW":
        return {
          label: t("new"),
          variant: "secondary" as const,
          className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        };
      case "CLASSIFIED":
        return {
          label: t("classified"),
          variant: "secondary" as const,
          className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
        };
      case "IN_PROGRESS":
        return {
          label: t("inProgress"),
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        };
      case "REPLIED":
        return {
          label: t("replied"),
          variant: "secondary" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-100",
        };
      case "CLOSED":
        return {
          label: t("closed"),
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        };
      default:
        return {
          label: status,
          variant: "outline" as const,
          className: "",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
