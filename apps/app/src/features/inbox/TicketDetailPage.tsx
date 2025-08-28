"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, Clock, User, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@myapp/ui/components/button";
import { Card } from "@myapp/ui/components/card";
import { Badge } from "@myapp/ui/components/badge";
import { Skeleton } from "@myapp/ui/components/skeleton";
import { Alert, AlertDescription } from "@myapp/ui/components/alert";
import { Separator } from "@myapp/ui/components/separator";
import { TicketStatusBadge } from "./components/TicketStatusBadge";
import { TicketPriorityBadge } from "./components/TicketPriorityBadge";
import { ReplyPanel } from "./components/ReplyPanel";
import { useTicketDetail } from "./hooks/useTicketDetail";

interface TicketDetailPageProps {
  params: Promise<{ ticketId: string }>;
}

export function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { ticketId } = use(params);
  const router = useRouter();
  const t = useTranslations("TicketDetailPage");
  const locale = useLocale();
  const dateLocale = locale === "ko" ? ko : enUS;
  
  const { data: ticket, isLoading, error, refetch } = useTicketDetail(ticketId);

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/inbox")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t("error")}: {error.message}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            </div>
            <div>
              <Card className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout>
        <Alert>
          <AlertDescription>{t("notFound")}</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/inbox")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {t("title", { id: ticket.id })}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("createdAt", {
                  date: format(new Date(ticket.createdAt), "PPP", { locale: dateLocale })
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
            {ticket.sentiment && (
              <Badge 
                className={
                  ticket.sentiment === "POSITIVE" ? "bg-green-100 text-green-800" :
                  ticket.sentiment === "NEGATIVE" ? "bg-red-100 text-red-800" :
                  "bg-gray-100 text-gray-800"
                }
              >
                {ticket.sentiment}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Citizen Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t("citizenInfo.title")}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("citizenInfo.name")}</p>
                  <p className="font-medium">{ticket.citizenName}</p>
                </div>
                {ticket.citizenPhone && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t("citizenInfo.phone")}</p>
                    <p className="font-medium">{ticket.citizenPhone}</p>
                  </div>
                )}
                {ticket.citizenEmail && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t("citizenInfo.email")}</p>
                    <p className="font-medium">{ticket.citizenEmail}</p>
                  </div>
                )}
                {ticket.citizenAddress && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">{t("citizenInfo.address")}</p>
                    <p className="font-medium">{ticket.citizenAddress}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Ticket Content */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t("content.title")}</h2>
              <div className="space-y-4">
                {ticket.category && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t("content.category")}</p>
                    <Badge variant="outline">{ticket.category}</Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t("content.description")}</p>
                  <p className="whitespace-pre-wrap">{ticket.content}</p>
                </div>
                {ticket.aiSummary && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t("content.aiSummary")}</p>
                    <Card className="p-4 bg-muted/50">
                      <p className="text-sm">{ticket.aiSummary}</p>
                      {ticket.aiConfidenceScore && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {t("content.confidence", { 
                            score: Math.round(ticket.aiConfidenceScore * 100) 
                          })}
                        </p>
                      )}
                    </Card>
                  </div>
                )}
              </div>
            </Card>

            {/* Updates History */}
            {ticket.updates && ticket.updates.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">{t("updates.title")}</h2>
                <div className="space-y-4">
                  {ticket.updates.map((update: any) => (
                    <div key={update.id} className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">
                            {update.user?.username || t("updates.system")}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(update.createdAt), "PPp", { locale: dateLocale })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {update.updateType === "STATUS_CHANGE" && t("updates.statusChange")}
                          {update.updateType === "COMMENT" && t("updates.comment")}
                          {update.updateType === "REPLY_SENT" && t("updates.replySent")}
                          {update.updateType === "ASSIGNMENT_CHANGE" && t("updates.assignmentChange")}
                          {update.updateType === "PRIORITY_CHANGE" && t("updates.priorityChange")}
                          {update.updateType === "CATEGORY_CHANGE" && t("updates.categoryChange")}
                        </p>
                        {update.replyText && (
                          <Card className="p-3 mt-2 bg-muted/50">
                            <p className="text-sm whitespace-pre-wrap">{update.replyText}</p>
                          </Card>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Panel - Reply Section */}
          <div className="lg:col-span-1">
            <ReplyPanel 
              ticket={ticket} 
              onReplySuccess={() => refetch()}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
