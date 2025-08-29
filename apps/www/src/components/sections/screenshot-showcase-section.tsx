"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Card } from "@myapp/ui/components/card";
import { Badge } from "@myapp/ui/components/badge";
import { Button } from "@myapp/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@myapp/ui/components/tabs";
import { 
  Inbox, 
  FileText,
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Star,
  Zap,
  Shield,
  Target,
  Phone,
  Mail,
  ChevronRight,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

// Screenshot components for each screen
const InboxScreenshot = () => (
  <div className="h-full flex flex-col">
    {/* Inbox header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">민원함</h3>
        <Badge variant="secondary">총 8건</Badge>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline">전체</Button>
        <Button size="sm" variant="outline">긴급</Button>
        <Button size="sm" variant="outline">대기중</Button>
      </div>
    </div>
    
    {/* Ticket list */}
    <div className="flex-1 space-y-2 overflow-hidden">
      <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
        <Badge variant="destructive">긴급</Badge>
        <div className="flex-1">
          <p className="text-sm font-medium">황단보도 신호등이 고장났습니다</p>
          <p className="text-xs text-muted-foreground">교통/도로 • 김민수</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-orange-600 font-medium">약 20시간 전</p>
          <p className="text-xs text-muted-foreground">SLA 1일 전</p>
        </div>
        <ChevronRight className="w-4 h-4" />
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
        <Badge variant="destructive">긴급</Badge>
        <div className="flex-1">
          <p className="text-sm font-medium">공원 놀이터 주변에 쓰레기가 많이 방치되어 있습니다</p>
          <p className="text-xs text-muted-foreground">환경/미화 • 이영희</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">약 20시간 전</p>
          <Badge variant="secondary" className="text-xs">답변완료</Badge>
        </div>
        <ChevronRight className="w-4 h-4" />
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
        <Badge>보통</Badge>
        <div className="flex-1">
          <p className="text-sm font-medium">도로에 균열이 생겨서 차량 통행이 위험합니다</p>
          <p className="text-xs text-muted-foreground">건설/도로 • 박철수</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">약 21시간 전</p>
          <Badge variant="outline" className="text-xs">답변완료</Badge>
        </div>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  </div>
);

const DetailScreenshot = () => (
  <div className="h-full flex">
    {/* Left side - ticket detail */}
    <div className="flex-1 p-4 border-r">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="destructive">긴급</Badge>
            <Badge>교통/도로</Badge>
            <span className="text-xs text-muted-foreground">2025년 08월 28일 20:24</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            티켓 #tkt_st0dq59xgc1pkj62fystwg4u
          </h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">이름:</span>
            <span className="text-sm font-medium">이영희</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">연락처:</span>
            <span className="text-sm font-medium">010-9876-5432</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">담당자:</span>
            <Badge variant="outline">AI 초안</Badge>
          </div>
        </div>
        
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm">
            공원 놀이터 주변에 쓰레기가 많이 방치되어 있습니다. 아이들이 놀기에 위생적으로 좋지 않아 보입니다.
          </p>
        </div>
      </div>
    </div>
    
    {/* Right side - AI response */}
    <div className="w-1/2 p-4 bg-muted/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">AI 답변 초안</h4>
        <Badge variant="outline" className="text-xs">
          <Sparkles className="w-3 h-3 mr-1" />
          생성됨
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="p-3 bg-background rounded-lg border">
          <p className="text-sm">
            안녕하세요, 이영희님.
            <br /><br />
            귀하께서 신고해주신 공원 놀이터 주변 쓰레기 방치 건에 대해 답변드립니다.
            <br /><br />
            해당 장소는 즉시 청소 작업을 진행하겠습니다. 
            환경미화팀에서 오늘 오후에 현장을 방문하여 쓰레기를 수거하고 청소할 예정입니다.
            <br /><br />
            앞으로도 정기적인 순찰과 청소로 깨끗한 공원 환경을 유지하도록 노력하겠습니다.
            <br /><br />
            민원 접수번호: tkt_st0dq59xgc1pkj62fystwg4u
            <br />
            처리 예정일: 2025년 08월 28일
          </p>
        </div>
        
        <Button className="w-full">
          <Send className="w-4 h-4 mr-2" />
          답변 발송
        </Button>
      </div>
    </div>
  </div>
);

const DashboardScreenshot = () => (
  <div className="h-full p-4 space-y-4">
    {/* KPI Cards */}
    <div className="grid grid-cols-4 gap-3">
      <Card className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">오늘 접수</p>
            <p className="text-2xl font-bold">47건</p>
            <p className="text-xs text-green-600">↑ 12%</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
            <Inbox className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </Card>
      
      <Card className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">오늘 처리</p>
            <p className="text-2xl font-bold">43건</p>
            <p className="text-xs text-muted-foreground">91.5%</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </Card>
      
      <Card className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">평균 처리 시간</p>
            <p className="text-2xl font-bold">1.8시간</p>
            <p className="text-xs text-green-600">↓ 72%</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </Card>
      
      <Card className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">시민 만족도</p>
            <p className="text-2xl font-bold">4.7/5.0</p>
            <p className="text-xs text-yellow-600">★★★★★</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center">
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
        </div>
      </Card>
    </div>
    
    {/* Charts row */}
    <div className="grid grid-cols-2 gap-3">
      {/* SLA Status */}
      <Card className="p-3">
        <h4 className="text-sm font-semibold mb-2">SLA 임박 민원</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">긴급</Badge>
              <span className="text-xs">도로 파손 - 중앙로</span>
            </div>
            <span className="text-xs text-orange-600">1시간 23분</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">긴급</Badge>
              <span className="text-xs">신호등 고장</span>
            </div>
            <span className="text-xs text-orange-600">2시간 45분</span>
          </div>
        </div>
      </Card>
      
      {/* Category distribution */}
      <Card className="p-3">
        <h4 className="text-sm font-semibold mb-2">카테고리별 민원 분포</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: "35%" }} />
            </div>
            <span className="text-xs">도로/교통 35%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: "25%" }} />
            </div>
            <span className="text-xs">환경/미화 25%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: "20%" }} />
            </div>
            <span className="text-xs">시설물 20%</span>
          </div>
        </div>
      </Card>
    </div>
    
    {/* Activity log */}
    <Card className="p-3">
      <h4 className="text-sm font-semibold mb-2">실시간 활동</h4>
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3 text-green-500" />
          <span>TKT-2024-0643 민원이 처리 완료되었습니다</span>
          <span className="text-muted-foreground ml-auto">3분 전</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3 text-blue-500" />
          <span>TKT-2024-0848 민원이 이영희님께 배정되었습니다</span>
          <span className="text-muted-foreground ml-auto">10분 전</span>
        </div>
      </div>
    </Card>
  </div>
);

const TimelineScreenshot = () => (
  <div className="h-full p-6 bg-gradient-to-b from-background to-muted/20">
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">민원 처리 진행상황</h2>
        <p className="text-muted-foreground">실시간으로 민원 처리 상황을 확인하세요</p>
      </div>
      
      {/* Progress bar */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
        <div className="absolute top-5 left-0 h-0.5 bg-primary" style={{ width: "60%" }} />
        <div className="flex justify-between relative">
          {["접수", "분류", "처리중", "답변완료"].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-background ${
                i <= 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted"
              }`}>
                {i <= 2 ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs">{i + 1}</span>}
              </div>
              <span className="text-xs mt-2">{step}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Ticket info */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">접수번호</span>
            <span className="font-mono text-sm">tkt_test_1756380267918</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">접수일시</span>
            <span className="text-sm">2025년 08월 28일 20:24</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">카테고리</span>
            <Badge>환경/미화</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">민원 내용</span>
            <Button variant="link" size="sm">전체보기</Button>
          </div>
          <div className="p-3 bg-muted/50 rounded">
            <p className="text-sm">
              공원 놀이터 주변에 쓰레기가 많이 방치되어 있습니다...
            </p>
          </div>
        </div>
      </Card>
      
      {/* Timeline events */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">처리 이력</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">민원이 접수되었습니다</p>
              <p className="text-xs text-muted-foreground">2025년 08월 28일 17:24</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">접수 → 분류</p>
              <p className="text-xs text-muted-foreground">2025년 08월 28일 17:54</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">담당자가 환경미화팀으로 배정되었습니다</p>
              <p className="text-xs text-muted-foreground">2025년 08월 28일 18:24</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

export const ScreenshotShowcaseSection = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("inbox");

  const screenshots = [
    {
      id: "inbox",
      title: t("screenshots.inbox.title"),
      subtitle: t("screenshots.inbox.subtitle"),
      description: t("screenshots.inbox.description"),
      image: "/images/screenshots/inbox.png",
      icon: <Inbox className="w-5 h-5" />,
      features: [
        {
          icon: <Zap className="w-4 h-4" />,
          text: "AI가 5초 내 자동 분류 및 우선순위 설정",
        },
        {
          icon: <Users className="w-4 h-4" />,
          text: "담당자 자동 배정 시스템",
        },
        {
          icon: <AlertCircle className="w-4 h-4" />,
          text: "SLA 임박 민원 실시간 알림",
        },
        {
          icon: <Target className="w-4 h-4" />,
          text: "우선순위별 색상 코딩 (긴급/높음/보통)",
        },
      ],
      stats: {
        label: "평균 처리 건수",
        value: "8건 → 43건/일",
        change: "+437%",
      },
    },
    {
      id: "detail",
      title: t("screenshots.detail.title"),
      subtitle: t("screenshots.detail.subtitle"),
      description: t("screenshots.detail.description"),
      image: "/images/screenshots/detail.png",
      icon: <FileText className="w-5 h-5" />,
      features: [
        {
          icon: <MessageSquare className="w-4 h-4" />,
          text: "AI 답변 초안 자동 생성",
        },
        {
          icon: <Clock className="w-4 h-4" />,
          text: "처리 이력 타임라인 표시",
        },
        {
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: "1클릭 답변 발송 시스템",
        },
        {
          icon: <Mail className="w-4 h-4" />,
          text: "멀티채널 알림 자동 발송",
        },
      ],
      stats: {
        label: "답변 작성 시간",
        value: "30분 → 2분",
        change: "-93%",
      },
    },
    {
      id: "dashboard",
      title: t("screenshots.dashboard.title"),
      subtitle: t("screenshots.dashboard.subtitle"),
      description: t("screenshots.dashboard.description"),
      image: "/images/screenshots/dashboard.png",
      icon: <BarChart3 className="w-5 h-5" />,
      features: [
        {
          icon: <TrendingUp className="w-4 h-4" />,
          text: "실시간 KPI 모니터링",
        },
        {
          icon: <Clock className="w-4 h-4" />,
          text: "SLA 준수율 추적",
        },
        {
          icon: <Star className="w-4 h-4" />,
          text: "시민 만족도 분석",
        },
        {
          icon: <Shield className="w-4 h-4" />,
          text: "AI 성능 지표 관리",
        },
      ],
      stats: {
        label: "SLA 준수율",
        value: "67% → 96.5%",
        change: "+44%",
      },
    },
    {
      id: "timeline",
      title: t("screenshots.timeline.title"),
      subtitle: t("screenshots.timeline.subtitle"),
      description: t("screenshots.timeline.description"),
      image: "/images/screenshots/timeline.png",
      icon: <Clock className="w-5 h-5" />,
      features: [
        {
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: "진행 단계별 실시간 업데이트",
        },
        {
          icon: <Phone className="w-4 h-4" />,
          text: "로그인 없이 접근 가능",
        },
        {
          icon: <Star className="w-4 h-4" />,
          text: "처리 완료 후 만족도 조사",
        },
        {
          icon: <MessageSquare className="w-4 h-4" />,
          text: "담당자 메시지 확인",
        },
      ],
      stats: {
        label: "전화 문의 감소",
        value: "100% → 11%",
        change: "-89%",
      },
    },
  ];

  const activeScreenshot = screenshots.find(s => s.id === activeTab);

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            {t("screenshots.badge")}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            {t("screenshots.title")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("screenshots.description")}
          </p>
        </div>

        {/* Tab navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4 mb-12">
            {screenshots.map((screenshot) => (
              <TabsTrigger 
                key={screenshot.id} 
                value={screenshot.id}
                className="flex items-center gap-2"
              >
                {screenshot.icon}
                <span className="hidden sm:inline">{screenshot.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {activeScreenshot && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Screenshot image */}
              <div className="relative order-2 lg:order-1">
                <div className="relative rounded-xl overflow-hidden shadow-2xl border bg-background">
                  {/* Browser mockup header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-background/50 rounded px-4 py-1 text-xs text-muted-foreground">
                        app.civicaid.kr/{activeScreenshot.id}
                      </div>
                    </div>
                  </div>
                  
                  {/* Screenshot content based on active tab */}
                  <div className="aspect-[16/10] bg-background relative overflow-hidden">
                    {/* Actual screenshot images from GitHub */}
                    {activeTab === "inbox" && (
                      <img 
                        src="/images/screenshots/inbox.png" 
                        alt="민원함 화면"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {activeTab === "detail" && (
                      <img 
                        src="/images/screenshots/detail.png" 
                        alt="티켓 상세 화면"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {activeTab === "dashboard" && (
                      <img 
                        src="/images/screenshots/dashboard.png" 
                        alt="대시보드 화면"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {activeTab === "timeline" && (
                      <img 
                        src="/images/screenshots/timeline.png" 
                        alt="시민 타임라인 화면"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Live indicator */}
                {activeScreenshot.id === "dashboard" && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    실시간
                  </div>
                )}
              </div>

              {/* Feature details */}
              <div className="space-y-6 order-1 lg:order-2">
                <div>
                  <Badge className="mb-2">{activeScreenshot.subtitle}</Badge>
                  <h3 className="text-3xl font-bold mb-3">{activeScreenshot.title}</h3>
                  <p className="text-lg text-muted-foreground">
                    {activeScreenshot.description}
                  </p>
                </div>

                {/* Features list */}
                <div className="space-y-3">
                  {activeScreenshot.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {feature.icon}
                      </div>
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Performance metric */}
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {activeScreenshot.stats.label}
                      </p>
                      <p className="text-2xl font-bold">
                        {activeScreenshot.stats.value}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="bg-green-500">
                        {activeScreenshot.stats.change}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* CTA button */}
                <Button size="lg" className="w-full sm:w-auto">
                  실제 데모 체험하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Tabs>

        {/* Bottom highlight */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                지금 바로 시작하세요
              </h3>
              <p className="text-muted-foreground">
                파일럿 프로그램 참여 시 3개월 무료 이용 가능
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                자료 요청
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button>
                무료 체험 신청
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
