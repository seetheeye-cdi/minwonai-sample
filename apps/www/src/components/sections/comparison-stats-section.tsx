"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@myapp/ui/components/card";
import { Badge } from "@myapp/ui/components/badge";
import { 
  Clock, 
  Phone, 
  Users, 
  Star,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const ComparisonStatsSection = () => {
  const t = useTranslations();

  const stats = [
    {
      category: "처리 시간",
      icon: <Clock className="w-8 h-8" />,
      before: {
        value: "6시간",
        description: "평균 민원 처리 시간",
      },
      after: {
        value: "1.8시간",
        description: "AI 도입 후",
      },
      improvement: "-70%",
      color: "from-blue-500 to-blue-600",
      details: "AI 자동 분류와 답변 생성으로 처리 시간 대폭 단축",
    },
    {
      category: "전화 문의",
      icon: <Phone className="w-8 h-8" />,
      before: {
        value: "100건/일",
        description: "일일 전화 문의",
      },
      after: {
        value: "11건/일",
        description: "실시간 알림 도입 후",
      },
      improvement: "-89%",
      color: "from-green-500 to-green-600",
      details: "시민이 직접 진행 상황을 확인할 수 있어 문의 급감",
    },
    {
      category: "처리량",
      icon: <Users className="w-8 h-8" />,
      before: {
        value: "15건/일",
        description: "담당자당 처리 건수",
      },
      after: {
        value: "43건/일",
        description: "자동화 도입 후",
      },
      improvement: "+287%",
      color: "from-purple-500 to-purple-600",
      details: "동일 인력으로 3배 이상의 민원 처리 가능",
    },
    {
      category: "만족도",
      icon: <Star className="w-8 h-8" />,
      before: {
        value: "3.2/5.0",
        description: "시민 만족도 점수",
      },
      after: {
        value: "4.7/5.0",
        description: "빠른 응답 후",
      },
      improvement: "+47%",
      color: "from-yellow-500 to-yellow-600",
      details: "신속한 처리와 실시간 소통으로 만족도 대폭 상승",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            실제 성과
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            숫자로 증명된 개선 효과
          </h2>
          <p className="text-xl text-muted-foreground">
            파일럿 기관에서 4주간 측정한 실제 데이터입니다
          </p>
        </div>

        {/* Comparison image if available */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-muted/50 border-b">
              <Badge>Before & After</Badge>
              <span className="text-xs text-muted-foreground">2025년 1월 기준</span>
            </div>
            <img 
              src="/images/workflow-process.png"
              alt="업무 프로세스 개선 비교"
              className="w-full h-auto"
            />
          </Card>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
              
              <div className="relative p-6">
                {/* Icon and category */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                    {stat.icon}
                  </div>
                  <Badge 
                    variant="default" 
                    className={`${
                      stat.improvement.startsWith('+') ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  >
                    {stat.improvement}
                  </Badge>
                </div>

                {/* Category title */}
                <h3 className="font-semibold text-lg mb-4">{stat.category}</h3>

                {/* Before/After comparison */}
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">이전</p>
                    <p className="text-xl font-bold line-through text-muted-foreground">
                      {stat.before.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.before.description}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1">현재</p>
                    <p className="text-2xl font-bold text-primary">
                      {stat.after.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.after.description}
                    </p>
                  </div>
                </div>

                {/* Detail description */}
                <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                  {stat.details}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <div className="flex items-center gap-6">
              <div>
                <BarChart3 className="w-12 h-12 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-2">
                  귀하의 기관도 이런 성과를 달성할 수 있습니다
                </h3>
                <p className="text-muted-foreground mb-4">
                  3개월 무료 파일럿 프로그램에 참여하세요
                </p>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">군포시 도입</Badge>
                  <Badge variant="outline">서대문구 예정</Badge>
                  <Badge variant="outline">3개 기관 대기중</Badge>
                </div>
              </div>
              <div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  참여 신청
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: <TrendingUp />, label: "ROI", value: "320%" },
            { icon: <Clock />, label: "투자 회수", value: "6개월" },
            { icon: <CheckCircle2 />, label: "도입 기간", value: "2주" },
            { icon: <Users />, label: "교육 시간", value: "4시간" },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                {React.cloneElement(item.icon, { className: "w-5 h-5 text-primary" })}
              </div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
