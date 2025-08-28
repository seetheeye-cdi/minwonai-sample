import { AIClient } from "./client";
import { 
  AIClassificationResult, 
  AIClassificationResultSchema, 
  ClassificationRequest,
  AssigneeMapping,
  AIServiceConfig 
} from "./types";

export class ComplaintClassifier {
  private aiClient: AIClient;

  constructor(config: AIServiceConfig) {
    this.aiClient = new AIClient(config);
  }

  async classifyComplaint(request: ClassificationRequest): Promise<AIClassificationResult> {
    try {
      // AI 분류 수행
      const rawResult = await this.aiClient.classifyComplaint(
        request.content,
        request.citizenName
      );

      // 담당자 추천 로직
      const suggestedAssigneeId = await this.suggestAssignee(
        rawResult.category,
        request.organizationId
      );

      // 결과 검증 및 변환
      const result = AIClassificationResultSchema.parse({
        category: rawResult.category,
        sentiment: rawResult.sentiment,
        priority: rawResult.priority,
        suggestedAssigneeId,
        confidence: rawResult.confidence || 0.8,
        summary: rawResult.summary,
      });

      return result;
    } catch (error) {
      console.error("민원 분류 실패:", error);
      
      // 기본값 반환 (수동 검토 필요)
      return {
        category: "기타",
        sentiment: "NEUTRAL",
        priority: "NORMAL",
        confidence: 0.0,
        summary: "AI 분류 실패 - 수동 검토 필요",
        suggestedAssigneeId: undefined,
      };
    }
  }

  private async suggestAssignee(
    category: string,
    organizationId: string
  ): Promise<string | undefined> {
    try {
      // 실제 구현에서는 데이터베이스에서 담당자 정보를 조회
      // 현재는 카테고리별 기본 매핑 로직으로 구현
      const categoryAssigneeMap: Record<string, string[]> = {
        "환경/미화": ["env_team"],
        "교통": ["traffic_team"],
        "건설/도로": ["construction_team"],
        "복지": ["welfare_team"],
        "세무/재정": ["finance_team"],
        "문화/체육": ["culture_team"],
        "교육": ["education_team"],
        "안전": ["safety_team"],
        "행정": ["admin_team"],
        "기타": ["general_team"],
      };

      const possibleAssignees = categoryAssigneeMap[category] || ["general_team"];
      
      // 현재는 첫 번째 담당자를 반환 (추후 워크로드 기반 로직으로 개선)
      return possibleAssignees[0];
    } catch (error) {
      console.error("담당자 추천 실패:", error);
      return undefined;
    }
  }

  async generateReplyDraft(
    ticketContent: string,
    category: string,
    citizenName?: string
  ): Promise<string> {
    try {
      return await this.aiClient.generateReplyDraft(ticketContent, category, citizenName);
    } catch (error) {
      console.error("답변 초안 생성 실패:", error);
      return "답변 초안을 생성할 수 없습니다. 수동으로 작성해 주세요.";
    }
  }
}

// 기본 설정으로 분류기 인스턴스 생성
export function createClassifier(apiKey?: string): ComplaintClassifier {
  const config: AIServiceConfig = {
    apiKey: apiKey || process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    timeout: 10000, // 10초
    maxRetries: 2,
  };

  if (!config.apiKey) {
    throw new Error("OpenAI API 키가 설정되지 않았습니다.");
  }

  return new ComplaintClassifier(config);
}
