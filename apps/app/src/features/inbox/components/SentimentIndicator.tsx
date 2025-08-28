"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@myapp/ui/components/badge";
import { 
  SmilePlus, 
  Meh, 
  Frown,
  AlertTriangle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@myapp/ui/components/tooltip";
import type { Sentiment } from "@myapp/prisma";

interface SentimentIndicatorProps {
  sentiment?: Sentiment | null;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function SentimentIndicator({ 
  sentiment, 
  showLabel = true,
  size = "md" 
}: SentimentIndicatorProps) {
  const t = useTranslations("InboxPage.sentiment");

  if (!sentiment) return null;

  const config = {
    POSITIVE: {
      icon: SmilePlus,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      label: t("positive"),
      description: t("positiveDesc"),
    },
    NEUTRAL: {
      icon: Meh,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      label: t("neutral"),
      description: t("neutralDesc"),
    },
    NEGATIVE: {
      icon: Frown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: t("negative"),
      description: t("negativeDesc"),
    },
  }[sentiment];

  const sizeConfig = {
    sm: { icon: "h-3 w-3", text: "text-xs", padding: "px-1.5 py-0.5" },
    md: { icon: "h-4 w-4", text: "text-sm", padding: "px-2 py-1" },
    lg: { icon: "h-5 w-5", text: "text-base", padding: "px-3 py-1.5" },
  }[size];

  const Icon = config.icon;

  const content = (
    <div 
      className={`inline-flex items-center gap-1.5 ${sizeConfig.padding} rounded-md border ${config.borderColor} ${config.bgColor}`}
    >
      <Icon className={`${sizeConfig.icon} ${config.color}`} />
      {showLabel && (
        <span className={`${sizeConfig.text} font-medium ${config.color}`}>
          {config.label}
        </span>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{config.label}</p>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// 감정 기반 우선순위 강조 배지
interface SentimentPriorityBadgeProps {
  sentiment?: Sentiment | null;
  priority: string;
}

export function SentimentPriorityBadge({ sentiment, priority }: SentimentPriorityBadgeProps) {
  const t = useTranslations("InboxPage.priority");
  
  // 부정적 감정 + 높은 우선순위 = 특별 강조
  const isHighAlert = sentiment === "NEGATIVE" && (priority === "HIGH" || priority === "URGENT");
  
  if (isHighAlert) {
    return (
      <div className="flex items-center gap-1">
        <Badge variant="destructive" className="animate-pulse">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {t("highAlert")}
        </Badge>
      </div>
    );
  }

  return null;
}
