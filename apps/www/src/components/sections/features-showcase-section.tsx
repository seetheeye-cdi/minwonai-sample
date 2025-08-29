"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@myapp/ui/components/tabs";
import { Card } from "@myapp/ui/components/card";
import { Badge } from "@myapp/ui/components/badge";
import { 
  Inbox, 
  Brain, 
  MessageSquare, 
  BarChart3,
  Bell,
  Users,
  Zap,
  Shield
} from "lucide-react";

export const FeaturesShowcaseSection = () => {
  const t = useTranslations();

  const features = [
    {
      id: "inbox",
      title: t("features.inbox.title"),
      description: t("features.inbox.description"),
      icon: <Inbox className="w-5 h-5" />,
      highlights: [
        "실시간 민원 목록",
        "AI 우선순위 자동 설정",
        "SLA 임박 알림",
        "담당자 자동 배정"
      ],
      metrics: {
        title: "처리 효율",
        value: "287%",
        change: "증가"
      }
    },
    {
      id: "ai-response",
      title: t("features.aiResponse.title"),
      description: t("features.aiResponse.description"),
      icon: <Brain className="w-5 h-5" />,
      highlights: [
        "카테고리별 템플릿 학습",
        "톤 & 스타일 조정",
        "유사 사례 참조",
        "1클릭 답변 생성"
      ],
      metrics: {
        title: "답변 작성 시간",
        value: "95%",
        change: "단축"
      }
    },
    {
      id: "timeline",
      title: t("features.timeline.title"),
      description: t("features.timeline.description"),
      icon: <MessageSquare className="w-5 h-5" />,
      highlights: [
        "시민용 진행 상황 페이지",
        "실시간 상태 업데이트",
        "모바일 최적화",
        "만족도 조사 통합"
      ],
      metrics: {
        title: "전화 문의",
        value: "89%",
        change: "감소"
      }
    },
    {
      id: "dashboard",
      title: t("features.dashboard.title"),
      description: t("features.dashboard.description"),
      icon: <BarChart3 className="w-5 h-5" />,
      highlights: [
        "실시간 KPI 모니터링",
        "SLA 준수율 추적",
        "팀 성과 분석",
        "트렌드 예측"
      ],
      metrics: {
        title: "SLA 준수율",
        value: "98%",
        change: "달성"
      }
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            {t("features.badge")}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            {t("features.title")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("features.description")}
          </p>
        </div>

        {/* Features showcase */}
        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4 mb-8">
            {features.map((feature) => (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id}
                className="flex items-center gap-2"
              >
                {feature.icon}
                <span className="hidden sm:inline">{feature.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="mt-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Feature details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-lg text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3">
                    {feature.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Metric card */}
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {feature.metrics.title}
                        </p>
                        <p className="text-3xl font-bold text-primary">
                          {feature.metrics.value}
                        </p>
                        <p className="text-sm font-medium text-green-600 mt-1">
                          {feature.metrics.change}
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        {feature.icon}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Feature preview */}
                <div className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8">
                    {/* Placeholder for actual screenshots */}
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                          {feature.icon}
                        </div>
                        <p className="text-white/60 text-sm">
                          {feature.title} 화면 미리보기
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security badge */}
                  {feature.id === "dashboard" && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      <Shield className="w-3 h-3" />
                      보안 인증
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            {t("features.cta.description")}
          </p>
          <div className="flex gap-4 justify-center">
            <Badge variant="secondary" className="px-3 py-1">
              <Bell className="w-3 h-3 mr-1" />
              실시간 알림
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Users className="w-3 h-3 mr-1" />
              다중 사용자
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Shield className="w-3 h-3 mr-1" />
              보안 인증
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};
