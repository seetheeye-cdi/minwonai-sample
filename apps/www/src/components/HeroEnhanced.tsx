"use client";

import { useTranslations } from "next-intl";
import { HeroSection } from "@/components/ui/hero-section";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { DISCORD_LINK, GET_STARTED_LINK } from "@/constants/links";
import { moveToGetStarted } from "@/lib/moveToApp";
import { Badge } from "@myapp/ui/components/badge";
import { Card } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { 
  Clock, 
  Phone, 
  TrendingUp, 
  Star,
  Users,
  CheckCircle2,
  Zap,
} from "lucide-react";

export const HeroEnhanced = () => {
  const t = useTranslations();

  const handleGetStartedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    moveToGetStarted();
  };

  const stats = [
    {
      icon: <Clock className="w-4 h-4" />,
      value: "1.8시간",
      label: "평균 처리",
      color: "text-blue-600",
    },
    {
      icon: <Phone className="w-4 h-4" />,
      value: "-89%",
      label: "전화 감소",
      color: "text-green-600",
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      value: "+287%",
      label: "처리량 증가",
      color: "text-purple-600",
    },
    {
      icon: <Star className="w-4 h-4" />,
      value: "4.7/5.0",
      label: "만족도",
      color: "text-yellow-600",
    },
  ];

  const features = [
    { icon: <Zap />, text: "5초 내 AI 자동 분류" },
    { icon: <Users />, text: "담당자 자동 배정" },
    { icon: <CheckCircle2 />, text: "1클릭 답변 발송" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                AI 기반 민원 처리 솔루션
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                파일럿 운영 중
              </Badge>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                하루 100건 민원,
                <br />
                <span className="text-primary">
                  이제 2시간이면
                </span>
                <br />
                충분합니다
              </h1>
              <p className="text-xl text-muted-foreground">
                AI가 민원을 자동 분류하고 답변을 생성해,<br />
                담당자는 검토와 클릭만 하면 됩니다.
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    {stat.icon}
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handleGetStartedClick}
                className="group"
              >
                무료 체험 시작하기
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="group"
              >
                <Play className="mr-2 h-4 w-4" />
                2분 데모 영상
              </Button>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm"
                >
                  <span className="text-primary">{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right content - Dashboard preview */}
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl">
              {/* Browser mockup header */}
              <div className="flex items-center justify-between p-3 bg-muted/50 border-b">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">app.civicaid.kr</div>
                <Badge variant="outline" className="text-xs">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                  Live
                </Badge>
              </div>
              
              {/* Actual dashboard screenshot */}
              <div className="relative">
                <img 
                  src="/images/screenshots/dashboard.png"
                  alt="CivicAid 대시보드"
                  className="w-full h-auto"
                />
                {/* Overlay for subtle animation */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
              </div>
            </Card>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-xs font-semibold">AI 정확도</div>
                  <div className="text-lg font-bold">96.5%</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-xs font-semibold">일일 처리량</div>
                  <div className="text-lg font-bold">287% ↑</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust indicators */}
        <div className="mt-20 pt-10 border-t">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              전국 지자체에서 신뢰하는 민원 처리 솔루션
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold">3개</div>
              <div className="text-xs text-muted-foreground">파일럿 기관</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">15,000+</div>
              <div className="text-xs text-muted-foreground">처리 민원</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-xs text-muted-foreground">재사용 의향</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-xs text-muted-foreground">안정 운영</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
