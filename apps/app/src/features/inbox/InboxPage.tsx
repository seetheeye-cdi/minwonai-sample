"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TicketList } from "./components/TicketList";
import { InboxFilters } from "./components/InboxFilters";
import { useTickets } from "./hooks/useTickets";
import type { TicketFilters } from "./types";

export function InboxPage() {
  const t = useTranslations("InboxPage");
  const [filters, setFilters] = useState<TicketFilters>({
    search: "",
    status: undefined,
    priority: undefined,
    sentiment: undefined,
    assignedToId: undefined,
    slaApproaching: false,
  });

  const { data: ticketsData, isLoading, error } = useTickets(filters);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title={t("title")}
          description={t("description")}
        />

        <InboxFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

        <TicketList
          tickets={ticketsData?.tickets || []}
          isLoading={isLoading}
          error={error}
          total={ticketsData?.total || 0}
          hasMore={ticketsData?.hasMore || false}
        />
      </div>
    </DashboardLayout>
  );
}
