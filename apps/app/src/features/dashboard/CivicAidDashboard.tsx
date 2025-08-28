"use client";

import { useTranslations } from "next-intl";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@myapp/ui/components/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@myapp/ui/components/table";
import { Badge } from "@myapp/ui/components/badge";
import { Button } from "@myapp/ui/components/button";
import { Skeleton } from "@myapp/ui/components/skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  MessageSquare,
  Star,
  ArrowRight,
} from "lucide-react";
import { api } from "@/utils/trpc/client";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";

// 색상 팔레트
const CHART_COLORS = ["#2C4A7A", "#4E7DD4", "#1CBCB2", "#FFA726", "#E05D5D"];

export function CivicAidDashboard() {
  const t = useTranslations("CivicAidDashboard");
  const locale = useLocale();
  const dateLocale = locale === "ko" ? ko : enUS;

  // API 호출 - 30초마다 자동 리페치
  const { data: stats, isLoading: statsLoading, error: statsError } = api.ticket.getDashboardStats.useQuery(
    undefined,
    {
      refetchInterval: 30000, // 30초마다 자동 갱신
      refetchOnWindowFocus: true,
      retry: false,
      enabled: false, // 임시로 비활성화
    }
  );

  const { data: slaTickets, isLoading: slaLoading, error: slaError } = api.ticket.getSLATickets.useQuery(
    { hoursThreshold: 24, limit: 10 },
    {
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      retry: false,
      enabled: false, // 임시로 비활성화
    }
  );

  const { data: trends, isLoading: trendsLoading, error: trendsError } = api.ticket.getTicketTrends.useQuery(
    { days: 7 },
    {
      refetchInterval: 60000, // 차트 데이터는 1분마다
      refetchOnWindowFocus: true,
      retry: false,
      enabled: false, // 임시로 비활성화
    }
  );

  const { data: satisfactionStats, isLoading: satisfactionLoading } = api.ticket.getSatisfactionStats.useQuery(
    {},
    {
      refetchInterval: 60000, // 1분마다 갱신
      refetchOnWindowFocus: true,
      retry: false,
      enabled: false, // 임시로 비활성화
    }
  );

  // KPI 카드 데이터
  const kpiCards = [
    {
      title: t("metrics.todayReceived"),
      value: stats?.today.received || 0,
      change: stats?.week.received || 0,
      changeLabel: t("metrics.weekTotal"),
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t("metrics.todayCompleted"),
      value: stats?.today.completed || 0,
      change: stats?.week.completed || 0,
      changeLabel: t("metrics.weekTotal"),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: t("metrics.todayDelayed"),
      value: stats?.today.delayed || 0,
      change: stats?.totalOpen || 0,
      changeLabel: t("metrics.totalOpen"),
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: t("metrics.avgResponseTime"),
      value: stats?.avgResponseTime ? `${stats.avgResponseTime}${t("metrics.minutes")}` : "-",
      change: stats?.satisfaction.average || 0,
      changeLabel: t("metrics.satisfactionScore"),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      showStar: true,
    },
  ];

  // 우선순위별 색상 매핑
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "destructive";
      case "HIGH":
        return "warning";
      case "NORMAL":
        return "secondary";
      case "LOW":
        return "outline";
      default:
        return "secondary";
    }
  };

  // 상태별 색상 매핑
  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "destructive";
      case "CLASSIFIED":
        return "warning";
      case "IN_PROGRESS":
        return "secondary";
      case "REPLIED":
        return "success";
      case "CLOSED":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title={t("title")} 
        description={t("description")}
      />

      {/* KPI 메트릭 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpiCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">
                  {card.title}
                </CardDescription>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-24 mb-2" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {card.value}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {card.showStar ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{card.change.toFixed(1)}/5.0</span>
                      </div>
                    ) : (
                      <span>{card.changeLabel}: {card.change}</span>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 차트와 SLA 임박 리스트 */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* 티켓 추이 차트 */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>{t("chart.ticketTrend")}</CardTitle>
            <CardDescription>{t("chart.last7Days")}</CardDescription>
          </CardHeader>
          <CardContent>
            {trendsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : trends?.daily && trends.daily.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends.daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="received" 
                    stroke="#4E7DD4" 
                    name={t("chart.received")}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#1CBCB2" 
                    name={t("chart.completed")}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                {t("chart.noData")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 카테고리별 분포 차트 */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("chart.categoryDistribution")}</CardTitle>
            <CardDescription>{t("chart.last7Days")}</CardDescription>
          </CardHeader>
          <CardContent>
            {trendsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : trends?.categories && trends.categories.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trends.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="category"
                  >
                    {trends.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                {t("chart.noData")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 만족도 통계 섹션 */}
      <div className="grid gap-6 lg:grid-cols-7 mt-6">
        {/* 만족도 평점 분포 */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("satisfaction.title")}</CardTitle>
            <CardDescription>{t("satisfaction.ratingDistribution")}</CardDescription>
          </CardHeader>
          <CardContent>
            {satisfactionLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : satisfactionStats ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold flex items-center gap-2">
                      <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                      {satisfactionStats.average.toFixed(1)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("satisfaction.totalResponses", { count: satisfactionStats.count })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {satisfactionStats.responseRate}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("satisfaction.responseRate")}
                    </p>
                  </div>
                </div>
                {satisfactionStats.distribution && satisfactionStats.distribution.length > 0 && (
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={satisfactionStats.distribution}>
                      <XAxis 
                        dataKey="rating" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}점`}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4E7DD4" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {t("satisfaction.noData")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 최근 피드백 */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>{t("satisfaction.recentFeedback")}</CardTitle>
            <CardDescription>{t("satisfaction.feedbackDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            {satisfactionLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : satisfactionStats?.recentFeedback && satisfactionStats.recentFeedback.length > 0 ? (
              <div className="space-y-3 max-h-[250px] overflow-y-auto">
                {satisfactionStats.recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < feedback.rating 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-gray-300"
                            }`} 
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">
                          {feedback.ticket.category || t("satisfaction.uncategorized")}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(feedback.submittedAt), { 
                          addSuffix: true, 
                          locale: dateLocale 
                        })}
                      </span>
                    </div>
                    {feedback.feedback && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {feedback.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {t("satisfaction.noFeedback")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SLA 임박 티켓 리스트 */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("sla.title")}</CardTitle>
              <CardDescription>{t("sla.description")}</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              {t("sla.viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {slaLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : slaTickets && slaTickets.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("sla.ticketId")}</TableHead>
                  <TableHead>{t("sla.citizen")}</TableHead>
                  <TableHead>{t("sla.category")}</TableHead>
                  <TableHead>{t("sla.priority")}</TableHead>
                  <TableHead>{t("sla.status")}</TableHead>
                  <TableHead>{t("sla.assignee")}</TableHead>
                  <TableHead>{t("sla.remaining")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slaTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono text-xs">
                      {ticket.id.slice(0, 10)}...
                    </TableCell>
                    <TableCell>{ticket.citizenName}</TableCell>
                    <TableCell>{ticket.category || t("sla.uncategorized")}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ticket.assignedTo?.username || t("sla.unassigned")}
                    </TableCell>
                    <TableCell>
                      {ticket.remainingHours !== null ? (
                        <div className="flex items-center gap-1">
                          {ticket.remainingHours <= 3 ? (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          ) : ticket.remainingHours <= 12 ? (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={
                            ticket.remainingHours <= 3 
                              ? "text-red-600 font-semibold" 
                              : ticket.remainingHours <= 12 
                              ? "text-yellow-600" 
                              : ""
                          }>
                            {ticket.remainingHours}h
                          </span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t("sla.noTickets")}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
