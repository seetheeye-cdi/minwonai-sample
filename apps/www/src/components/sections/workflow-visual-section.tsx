"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@myapp/ui/components/badge";
import { Card } from "@myapp/ui/components/card";
import { 
  ArrowRight,
  MessageSquare,
  Brain,
  Users,
  Send,
  CheckCircle2,
  Clock,
  Star,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";

export const WorkflowVisualSection = () => {
  const t = useTranslations();

  const workflowSteps = [
    {
      step: 1,
      icon: <MessageSquare className="w-6 h-6" />,
      title: "민원 접수",
      description: "시민이 제출한 민원이 시스템에 등록됩니다",
      time: "즉시",
      color: "from-blue-500 to-blue-600",
      details: [
        "다양한 채널로 접수 (웹/앱/전화)",
        "접수 확인 알림 자동 발송",
        "고유 접수번호 생성",
      ],
    },
    {
      step: 2,
      icon: <Brain className="w-6 h-6" />,
      title: "AI 분석",
      description: "내용 분석 및 자동 분류가 진행됩니다",
      time: "5초",
      color: "from-purple-500 to-purple-600",
      details: [
        "12개 카테고리로 자동 분류",
        "긴급도 및 감정 분석",
        "96.5% 정확도",
      ],
    },
    {
      step: 3,
      icon: <Users className="w-6 h-6" />,
      title: "담당자 배정",
      description: "적절한 담당자에게 자동 배정됩니다",
      time: "10초",
      color: "from-green-500 to-green-600",
      details: [
        "업무 분장표 기반 자동 배정",
        "담당자 업무량 고려",
        "배정 알림 즉시 전송",
      ],
    },
    {
      step: 4,
      icon: <Send className="w-6 h-6" />,
      title: "답변 발송",
      description: "AI 초안 검토 후 답변을 발송합니다",
      time: "2분",
      color: "from-cyan-500 to-cyan-600",
      details: [
        "AI 답변 초안 자동 생성",
        "톤 조정 및 수정 가능",
        "1클릭 멀티채널 발송",
      ],
    },
    {
      step: 5,
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "처리 완료",
      description: "민원이 완료되고 만족도 조사가 진행됩니다",
      time: "전체 1.8시간",
      color: "from-orange-500 to-orange-600",
      details: [
        "처리 완료 알림 발송",
        "만족도 조사 링크 전송",
        "통계 자동 업데이트",
      ],
    },
  ];

  const beforeAfter = [
    {
      metric: "평균 처리 시간",
      before: "6시간",
      after: "1.8시간",
      improvement: "-70%",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      metric: "전화 문의",
      before: "하루 100건",
      after: "하루 11건",
      improvement: "-89%",
      icon: <Phone className="w-5 h-5" />,
    },
    {
      metric: "담당자 처리량",
      before: "15건/일",
      after: "43건/일",
      improvement: "+287%",
      icon: <Users className="w-5 h-5" />,
    },
    {
      metric: "시민 만족도",
      before: "3.2/5.0",
      after: "4.7/5.0",
      improvement: "+47%",
      icon: <Star className="w-5 h-5" />,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            {t("workflow.badge")}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            {t("workflow.title")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("workflow.description")}
          </p>
        </div>

        {/* Workflow visualization */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 hidden lg:block" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            {workflowSteps.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connector arrow for mobile */}
                {index < workflowSteps.length - 1 && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 lg:hidden">
                    <ChevronRight className="w-6 h-6 text-primary/30 rotate-90 lg:rotate-0" />
                  </div>
                )}
                
                <Card className="p-6 hover:shadow-lg transition-all duration-300 h-full">
                  {/* Step number */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-xs">
                      STEP {step.step}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {step.time}
                    </Badge>
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-4`}>
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {step.description}
                  </p>
                  
                  {/* Details */}
                  <ul className="space-y-1">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                        <span className="text-primary mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Before/After comparison */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-3">
              {t("workflow.comparison.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("workflow.comparison.description")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beforeAfter.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold">{item.metric}</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">이전</span>
                    <span className="font-medium line-through text-muted-foreground">
                      {item.before}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">현재</span>
                    <span className="text-xl font-bold text-primary">
                      {item.after}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <Badge 
                      variant="default" 
                      className={`w-full justify-center ${
                        item.improvement.startsWith('+') ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    >
                      {item.improvement} 개선
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <h3 className="text-2xl font-bold mb-3">
              이제 민원 업무가 즐거워집니다
            </h3>
            <p className="text-muted-foreground mb-6">
              복잡했던 민원 처리가 단순하고 효율적으로 바뀝니다
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>카카오톡 우선</span>
              <span>•</span>
              <Phone className="w-4 h-4" />
              <span>SMS 백업</span>
              <span>•</span>
              <CheckCircle2 className="w-4 h-4" />
              <span>100% 전달 보장</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
