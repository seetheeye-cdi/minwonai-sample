"use client";

import { useTranslations } from "next-intl";
import { 
  MousePointerClick, 
  Sparkles, 
  Send, 
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Badge } from "@myapp/ui/components/badge";
import { Card } from "@myapp/ui/components/card";

export const HowItWorksSection = () => {
  const t = useTranslations();

  const steps = [
    {
      step: "01",
      title: t("howItWorks.steps.receive.title"),
      description: t("howItWorks.steps.receive.description"),
      icon: <MousePointerClick className="w-6 h-6" />,
      badge: "5초",
      color: "from-blue-500 to-blue-600",
      stats: {
        before: "수동 분류 15분",
        after: "AI 자동 5초"
      }
    },
    {
      step: "02",
      title: t("howItWorks.steps.classify.title"),
      description: t("howItWorks.steps.classify.description"),
      icon: <Sparkles className="w-6 h-6" />,
      badge: "96% 정확도",
      color: "from-purple-500 to-purple-600",
      stats: {
        before: "담당자 수동 배정",
        after: "규칙 기반 자동 배정"
      }
    },
    {
      step: "03",
      title: t("howItWorks.steps.draft.title"),
      description: t("howItWorks.steps.draft.description"),
      icon: <Send className="w-6 h-6" />,
      badge: "1클릭",
      color: "from-green-500 to-green-600",
      stats: {
        before: "답변 작성 30분",
        after: "AI 초안 검토 2분"
      }
    },
    {
      step: "04",
      title: t("howItWorks.steps.notify.title"),
      description: t("howItWorks.steps.notify.description"),
      icon: <CheckCircle2 className="w-6 h-6" />,
      badge: "실시간",
      color: "from-cyan-500 to-cyan-600",
      stats: {
        before: "전화 문의 폭주",
        after: "자동 알림 발송"
      }
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            {t("howItWorks.badge")}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("howItWorks.description")}
          </p>
        </div>

        {/* Process steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="relative p-6 hover:shadow-lg transition-all duration-300 group">
              {/* Step number */}
              <div className={`absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                {step.step}
              </div>
              
              {/* Icon and badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${step.color} text-white`}>
                  {step.icon}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {step.badge}
                </Badge>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {step.description}
              </p>

              {/* Before/After comparison */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-red-500">❌</span>
                  <span className="line-through text-muted-foreground">{step.stats.before}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-500">✅</span>
                  <span className="font-medium">{step.stats.after}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Real-time dashboard preview */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                {t("howItWorks.dashboard.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("howItWorks.dashboard.description")}
              </p>
              
              {/* Key metrics */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm">
                    <strong>평균 처리 시간:</strong> 6시간 → 1.5시간
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm">
                    <strong>담당자 1인당 처리량:</strong> 15건 → 43건/일
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-sm">
                    <strong>시민 만족도:</strong> 3.2 → 4.7/5.0
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm">
                    <strong>SLA 준수율:</strong> 67% → 98%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Dashboard preview image */}
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="/images/dashboard-preview.png" 
                  alt="CivicAid Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Live indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
