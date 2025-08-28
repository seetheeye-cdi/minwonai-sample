import { z } from "zod";

// Prisma에서 직접 타입 import
import type { Sentiment, TicketPriority } from "@myapp/prisma";

// 타입 재수출
export type { Sentiment, TicketPriority };

// AI 분류 결과 스키마
export const AIClassificationResultSchema = z.object({
  category: z.string().describe("민원 카테고리 (예: 환경/미화, 교통, 건설/도로 등)"),
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"]).describe("감정 분석 결과"),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).describe("우선순위 (감정 분석 기반)"),
  suggestedAssigneeId: z.string().optional().describe("추천 담당자 ID"),
  confidence: z.number().min(0).max(1).describe("분류 신뢰도 (0-1)"),
  summary: z.string().describe("민원 요약"),
  draftAnswer: z.string().optional().describe("AI 생성 답변 초안"),
});

export type AIClassificationResult = z.infer<typeof AIClassificationResultSchema>;

// 민원 분류 요청 데이터
export interface ClassificationRequest {
  content: string;
  citizenName?: string;
  organizationId: string;
}

// 담당자 매핑 정보
export interface AssigneeMapping {
  userId: string;
  categories: string[];
  workload: number; // 현재 담당 티켓 수
}

// AI 서비스 설정
export interface AIServiceConfig {
  apiKey: string;
  model: string;
  timeout: number;
  maxRetries: number;
}