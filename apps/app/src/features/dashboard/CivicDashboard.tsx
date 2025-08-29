"use client";

import { useState, useEffect } from "react";
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
import { Progress } from "@myapp/ui/components/progress";
import { Alert, AlertDescription } from "@myapp/ui/components/alert";
import { 
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Star,
  ArrowRight,
  Phone,
  Mail,
  FileText,
  Activity,
  Timer,
  Target,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import Link from "next/link";

// 민원 상태별 색상
const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-700";
    case "classified":
      return "bg-purple-100 text-purple-700";
    case "in_progress":
      return "bg-yellow-100 text-yellow-700";
    case "replied":
      return "bg-green-100 text-green-700";
    case "closed":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// 우선순위별 색상
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "default";
    case "normal":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "secondary";
  }
};

export function CivicDashboard() {
  const t = useTranslations("CivicDashboard");
  const locale = useLocale();
  const dateLocale = locale === "ko" ? ko : enUS;

  // 모의 데이터 (실제로는 API에서 가져올 데이터)
  const [isLoading, setIsLoading] = useState(false);
  
  // 오늘의 KPI 데이터
  const kpiData = {
    todayReceived: 47,
    todayResolved: 43,
    pendingTotal: 124,
    avgResponseTime: 1.8,
    slaCompliance: 96.5,
    satisfaction: 4.7,
    phoneReduction: 89,
    processingIncrease: 287,
  };

  // 시간별 트렌드 데이터
  const hourlyTrend = [
    { hour: "09시", received: 8, resolved: 5 },
    { hour: "10시", received: 12, resolved: 10 },
    { hour: "11시", received: 15, resolved: 14 },
    { hour: "12시", received: 5, resolved: 8 },
    { hour: "13시", received: 3, resolved: 2 },
    { hour: "14시", received: 9, resolved: 11 },
    { hour: "15시", received: 11, resolved: 12 },
    { hour: "16시", received: 8, resolved: 9 },
    { hour: "17시", received: 6, resolved: 7 },
  ];

  // SLA 임박 민원 리스트
  const slaTickets = [
    {
      id: "TKT-2024-0847",
      title: "도로 파손 신고 - 중앙로 147번지",
      category: "도로/교통",
      priority: "urgent",
      remainingTime: "1시간 23분",
      assignee: "김민수",
      progress: 85,
    },
    {
      id: "TKT-2024-0846",
      title: "가로등 고장 신고",
      category: "시설물",
      priority: "high",
      remainingTime: "2시간 45분",
      assignee: "이영희",
      progress: 70,
    },
    {
      id: "TKT-2024-0845",
      title: "불법 주정차 신고",
      category: "교통",
      priority: "high",
      remainingTime: "3시간 12분",
      assignee: "박지원",
      progress: 60,
    },
    {
      id: "TKT-2024-0844",
      title: "소음 민원",
      category: "환경",
      priority: "normal",
      remainingTime: "4시간 30분",
      assignee: "최수진",
      progress: 45,
    },
  ];

  // 카테고리별 통계
  const categoryStats = [
    { name: "도로/교통", count: 32, percentage: 25.8 },
    { name: "환경/위생", count: 28, percentage: 22.6 },
    { name: "시설물", count: 24, percentage: 19.4 },
    { name: "복지/보건", count: 20, percentage: 16.1 },
    { name: "기타", count: 20, percentage: 16.1 },
  ];

  // 최근 활동 로그
  const recentActivities = [
    {
      type: "resolved",
      message: "TKT-2024-0843 민원이 처리 완료되었습니다",
      user: "김민수",
      time: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      type: "assigned",
      message: "TKT-2024-0848 민원이 이영희님께 배정되었습니다",
      user: "시스템",
      time: new Date(Date.now() - 10 * 60 * 1000),
    },
    {
      type: "received",
      message: "새로운 민원 5건이 접수되었습니다",
      user: "시스템",
      time: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      type: "sla_warning",
      message: "TKT-2024-0847 민원이 SLA 임박 상태입니다",
      user: "시스템",
      time: new Date(Date.now() - 20 * 60 * 1000),
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "assigned":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "received":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "sla_warning":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title={t("title")} 
        description={t("description")}
      />

      {/* 실시간 알림 배너 */}
      {kpiData.slaCompliance < 90 && (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            SLA 준수율이 90% 미만입니다. 긴급 민원을 우선 처리해주세요.
          </AlertDescription>
        </Alert>
      )}

      {/* KPI 메트릭 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">
                오늘 접수
              </CardDescription>
              <div className="p-2 rounded-lg bg-blue-100">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.todayReceived}건</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span>어제 대비 +12%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">
                오늘 처리
              </CardDescription>
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.todayResolved}건</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="text-green-600">처리율 91.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">
                평균 처리 시간
              </CardDescription>
              <div className="p-2 rounded-lg bg-purple-100">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.avgResponseTime}시간</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
              <span>72% 단축</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">
                시민 만족도
              </CardDescription>
              <div className="p-2 rounded-lg bg-yellow-100">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.satisfaction}/5.0</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= Math.floor(kpiData.satisfaction)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 메인 대시보드 그리드 */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* SLA 임박 민원 리스트 */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">SLA 임박 민원</CardTitle>
                <CardDescription>처리 시한이 임박한 민원 목록</CardDescription>
              </div>
              <Link href="/inbox?filter=sla">
                <Button variant="outline" size="sm">
                  전체 보기
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {slaTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{ticket.id}</span>
                        <Badge variant={getPriorityColor(ticket.priority)} className="text-xs">
                          {ticket.priority === "urgent" ? "긴급" : ticket.priority === "high" ? "높음" : "보통"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {ticket.category}
                        </Badge>
                      </div>
                      <p className="text-sm line-clamp-1">{ticket.title}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {ticket.assignee}
                        </span>
                        <span className="flex items-center gap-1 text-orange-600 font-medium">
                          <Timer className="h-3 w-3" />
                          {ticket.remainingTime} 남음
                        </span>
                      </div>
                    </div>
                  </div>
                  <Progress value={ticket.progress} className="h-1.5 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 실시간 활동 로그 */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">실시간 활동</CardTitle>
                <CardDescription>최근 시스템 활동 내역</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(activity.time, {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 하단 통계 섹션 */}
      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        {/* 카테고리별 분포 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">카테고리별 민원 분포</CardTitle>
            <CardDescription>오늘 접수된 민원 카테고리</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryStats.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm">{category.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({category.count}건)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={category.percentage} 
                      className="w-20 h-2"
                    />
                    <span className="text-xs font-medium w-12 text-right">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 처리 성과 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">처리 성과</CardTitle>
            <CardDescription>이번 주 주요 성과 지표</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">SLA 준수율</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {kpiData.slaCompliance}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="text-sm">전화 문의 감소</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  -{kpiData.phoneReduction}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">처리량 증가</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  +{kpiData.processingIncrease}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI 성능 지표 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI 성능</CardTitle>
            <CardDescription>자동화 처리 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">자동 분류 정확도</span>
                <span className="text-lg font-bold">96.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AI 답변 채택률</span>
                <span className="text-lg font-bold">88.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">평균 처리 시간</span>
                <span className="text-lg font-bold">5초</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>오늘 AI 처리 건수</span>
                  <span className="font-medium">43/47건</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
