"use client";

import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { Clock, MessageSquare, User, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@myapp/ui/components/table";
import { Badge } from "@myapp/ui/components/badge";
import { Button } from "@myapp/ui/components/button";
import { Card } from "@myapp/ui/components/card";
import { Skeleton } from "@myapp/ui/components/skeleton";
import { Alert, AlertDescription } from "@myapp/ui/components/alert";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketPriorityBadge } from "./TicketPriorityBadge";
import type { TicketListItem } from "../types";

interface TicketListProps {
  tickets: TicketListItem[];
  isLoading: boolean;
  error: Error | null;
  total: number;
  hasMore: boolean;
}

export function TicketList({ tickets, isLoading, error, total, hasMore }: TicketListProps) {
  const t = useTranslations("InboxPage.ticketList");
  const locale = useLocale();
  const dateLocale = locale === "ko" ? ko : enUS;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {t("error")}: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <div className="p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">{t("empty.title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("empty.description")}
          </p>
        </div>
      </Card>
    );
  }

  const getSlaStatus = (slaDueAt?: Date | null) => {
    if (!slaDueAt) return null;
    
    const now = new Date();
    const slaDate = new Date(slaDueAt);
    const hoursLeft = (slaDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursLeft < 0) return "overdue";
    if (hoursLeft < 24) return "approaching";
    return "normal";
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">{t("title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("totalCount", { count: total })}
            </p>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">{t("columns.id")}</TableHead>
                <TableHead>{t("columns.citizen")}</TableHead>
                <TableHead>{t("columns.content")}</TableHead>
                <TableHead>{t("columns.category")}</TableHead>
                <TableHead>{t("columns.status")}</TableHead>
                <TableHead>{t("columns.priority")}</TableHead>
                <TableHead>{t("columns.assignee")}</TableHead>
                <TableHead>{t("columns.sla")}</TableHead>
                <TableHead>{t("columns.created")}</TableHead>
                <TableHead className="w-[50px]">{t("columns.updates")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => {
                const slaStatus = getSlaStatus(ticket.slaDueAt);
                
                return (
                  <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">
                      {ticket.id.slice(-8)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {ticket.citizenName}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate" title={ticket.content}>
                        {ticket.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      {ticket.category && (
                        <Badge variant="outline" className="text-xs">
                          {ticket.category}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <TicketStatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell>
                      <TicketPriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell>
                      {ticket.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {ticket.assignedTo.username || ticket.assignedTo.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {t("unassigned")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {ticket.slaDueAt && (
                        <div className="flex items-center gap-2">
                          <Clock className={`h-4 w-4 ${
                            slaStatus === "overdue" ? "text-red-500" :
                            slaStatus === "approaching" ? "text-yellow-500" :
                            "text-muted-foreground"
                          }`} />
                          <span className={`text-xs ${
                            slaStatus === "overdue" ? "text-red-600" :
                            slaStatus === "approaching" ? "text-yellow-600" :
                            "text-muted-foreground"
                          }`}>
                            {formatDistanceToNow(new Date(ticket.slaDueAt), {
                              addSuffix: true,
                              locale: dateLocale,
                            })}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(ticket.createdAt), {
                        addSuffix: true,
                        locale: dateLocale,
                      })}
                    </TableCell>
                    <TableCell>
                      {ticket._count.updates > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {ticket._count.updates}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {hasMore && (
          <div className="mt-6 text-center">
            <Button variant="outline">
              {t("loadMore")}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
