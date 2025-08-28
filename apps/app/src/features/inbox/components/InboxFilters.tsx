"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@myapp/ui/components/input";
import { Button } from "@myapp/ui/components/button";
import { Badge } from "@myapp/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@myapp/ui/components/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@myapp/ui/components/popover";
import { Checkbox } from "@myapp/ui/components/checkbox";
import { useDebounce } from "@/hooks/useDebounce";
import type { TicketFilters } from "../types";
import { TicketStatus, TicketPriority } from "@myapp/prisma";

interface InboxFiltersProps {
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
}

export function InboxFilters({ filters, onFiltersChange }: InboxFiltersProps) {
  const t = useTranslations("InboxPage.filters");
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === "all" ? undefined : (value as TicketStatus),
    });
  };

  const handlePriorityChange = (value: string) => {
    onFiltersChange({
      ...filters,
      priority: value === "all" ? undefined : (value as TicketPriority),
    });
  };

  const handleSlaApproachingChange = (checked: boolean) => {
    onFiltersChange({ ...filters, slaApproaching: checked });
  };

  const clearFilters = () => {
    setSearchInput("");
    onFiltersChange({
      search: "",
      status: undefined,
      priority: undefined,
      assignedToId: undefined,
      slaApproaching: false,
    });
  };

  const activeFiltersCount = [
    filters.status,
    filters.priority,
    filters.assignedToId,
    filters.slaApproaching,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("status.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("status.all")}</SelectItem>
            <SelectItem value="NEW">{t("status.new")}</SelectItem>
            <SelectItem value="CLASSIFIED">{t("status.classified")}</SelectItem>
            <SelectItem value="IN_PROGRESS">{t("status.inProgress")}</SelectItem>
            <SelectItem value="REPLIED">{t("status.replied")}</SelectItem>
            <SelectItem value="CLOSED">{t("status.closed")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={filters.priority || "all"}
          onValueChange={handlePriorityChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={t("priority.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("priority.all")}</SelectItem>
            <SelectItem value="LOW">{t("priority.low")}</SelectItem>
            <SelectItem value="NORMAL">{t("priority.normal")}</SelectItem>
            <SelectItem value="HIGH">{t("priority.high")}</SelectItem>
            <SelectItem value="URGENT">{t("priority.urgent")}</SelectItem>
          </SelectContent>
        </Select>

        {/* More Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {t("moreFilters")}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{t("additionalFilters")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("additionalFiltersDescription")}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sla-approaching"
                  checked={filters.slaApproaching}
                  onCheckedChange={handleSlaApproachingChange}
                />
                <label
                  htmlFor="sla-approaching"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("slaApproaching")}
                </label>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {(activeFiltersCount > 0 || filters.search) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            {t("clearFilters")}
          </Button>
        )}
      </div>
    </div>
  );
}
