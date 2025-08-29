"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Card } from "@myapp/ui/components/card";
import { Badge } from "@myapp/ui/components/badge";
import { Button } from "@myapp/ui/components/button";
import { 
  Zap, 
  Brain, 
  Users, 
  BarChart3, 
  Bell, 
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const FeatureShowcaseWithImages = () => {
  const t = useTranslations();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI 자동 분류 시스템",
      subtitle: "96.5% 정확도",
      description: "민원 내용을 자동으로 분석하여 12개 카테고리로 분류하고, 적절한 담당자에게 자동 배정합니다.",
      benefits: [
        "5초 내 자동 분류 완료",
        "감정 분석 기반 우선순위 설정",
        "담당자 업무량 고려한 스마트 배정",
        "지속적인 학습으로 정확도 향상",
      ],
      metrics: {
        label: "분류 정확도",
        value: "96.5%",
        change: "+15%",
      },
      image: "/images/features/ai-classification.png",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI 답변 생성",
      subtitle: "2분 내 작성",
      description: "카테고리별 템플릿과 과거 답변을 학습하여 최적의 답변 초안을 자동으로 생성합니다.",
      benefits: [
        "맞춤형 답변 템플릿 제공",
        "톤 & 매너 자동 조정",
        "법적 검토 사항 자동 체크",
        "1클릭 수정 및 발송",
      ],
      metrics: {
        label: "답변 시간",
        value: "30분→2분",
        change: "-93%",
      },
      image: "/images/features/ai-response.png",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "멀티채널 알림",
      subtitle: "100% 전달 보장",
      description: "카카오톡, SMS, 이메일을 통해 시민에게 실시간으로 처리 상황을 알려드립니다.",
      benefits: [
        "카카오 알림톡 우선 발송",
        "SMS 자동 백업 시스템",
        "단계별 자동 알림 발송",
        "시민 선호 채널 자동 선택",
      ],
      metrics: {
        label: "전화 문의",
        value: "100%→11%",
        change: "-89%",
      },
      image: "/images/features/notification.png",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "실시간 대시보드",
      subtitle: "한눈에 파악",
      description: "모든 민원 처리 현황을 실시간으로 모니터링하고 성과를 분석합니다.",
      benefits: [
        "실시간 KPI 모니터링",
        "SLA 준수율 추적",
        "담당자별 성과 분석",
        "AI 성능 지표 관리",
      ],
      metrics: {
        label: "처리량",
        value: "15→43건/일",
        change: "+287%",
      },
      image: "/images/screenshots/dashboard.png",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const currentFeature = features[activeFeature];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            핵심 기능 상세
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            CivicAid가 제공하는 혁신적인 기능
          </h2>
          <p className="text-xl text-muted-foreground">
            AI 기술과 자동화로 민원 처리의 모든 단계를 혁신합니다
          </p>
        </div>

        {/* Feature selector */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`p-4 cursor-pointer transition-all ${
                activeFeature === index 
                  ? "border-primary shadow-lg" 
                  : "hover:shadow-md"
              }`}
              onClick={() => setActiveFeature(index)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.subtitle}</p>
                </div>
              </div>
              {activeFeature === index && (
                <div className="mt-3 pt-3 border-t">
                  <Badge variant="default" className="text-xs">
                    선택됨
                  </Badge>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Feature detail */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border bg-background">
              {/* Browser mockup */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground">
                    app.civicaid.kr/{currentFeature.title.toLowerCase().replace(/\s/g, '-')}
                  </span>
                </div>
              </div>
              
              {/* Feature screenshot or illustration */}
              {currentFeature.image ? (
                <img 
                  src={currentFeature.image}
                  alt={currentFeature.title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[16/10] bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentFeature.color} flex items-center justify-center mx-auto mb-4 text-white`}>
                      {currentFeature.icon}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentFeature.title}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Floating metric */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{currentFeature.metrics.label}</p>
                  <p className="text-lg font-bold">{currentFeature.metrics.value}</p>
                  <Badge variant="default" className="text-xs bg-green-500">
                    {currentFeature.metrics.change}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${currentFeature.color} flex items-center justify-center text-white`}>
                  {currentFeature.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{currentFeature.title}</h3>
                  <Badge variant="outline">{currentFeature.subtitle}</Badge>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">
                {currentFeature.description}
              </p>
            </div>

            {/* Benefits list */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                주요 이점
              </h4>
              {currentFeature.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Performance highlight */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold">성과 개선</span>
                <Badge variant="default" className="bg-green-500">
                  {currentFeature.metrics.change}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">이전</span>
                  <span className="line-through text-muted-foreground">
                    {currentFeature.metrics.value.split('→')[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">현재</span>
                  <span className="text-xl font-bold text-primary">
                    {currentFeature.metrics.value.split('→')[1] || currentFeature.metrics.value}
                  </span>
                </div>
              </div>
            </Card>

            {/* CTA */}
            <div className="flex gap-3">
              <Button size="lg">
                자세히 알아보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                데모 체험하기
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom trust indicators */}
        <div className="mt-20 grid md:grid-cols-4 gap-6">
          {[
            { icon: <Shield />, label: "보안 인증", value: "ISO 27001" },
            { icon: <Clock />, label: "가동 시간", value: "99.9%" },
            { icon: <Users />, label: "활성 사용자", value: "500+" },
            { icon: <CheckCircle2 />, label: "처리 민원", value: "15,000+" },
          ].map((stat, index) => (
            <Card key={index} className="p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                {React.cloneElement(stat.icon, { className: "w-5 h-5 text-primary" })}
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
