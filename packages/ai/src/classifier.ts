import { AnthropicClient } from "./anthropic-client";
import { 
  AIClassificationResult, 
  AIClassificationResultSchema, 
  ClassificationRequest
} from "./types";

export class ComplaintClassifier {
  private aiClient: AnthropicClient;

  constructor(apiKey?: string) {
    this.aiClient = new AnthropicClient(apiKey);
  }

  async classify(
    content: string,
    citizenName?: string,
    organizationId?: string
  ): Promise<AIClassificationResult> {
    try {
      const result = await this.aiClient.classifyComplaint(content, citizenName);
      
      // 담당자 추천 로직 (선택사항)
      const suggestedAssigneeId = await this.suggestAssignee(
        result.category,
        organizationId || ""
      );

      return {
        ...result,
        suggestedAssigneeId,
      };
    } catch (error) {
      console.error("민원 분류 실패:", error);
      
      // 기본값 반환 (수동 검토 필요)
      return {
        category: "기타",
        sentiment: "NEUTRAL",
        priority: "NORMAL",
        confidence: 0.0,
        summary: "AI 분류 실패 - 수동 검토 필요",
        draftAnswer: "민원을 접수했습니다. 담당자가 확인 후 연락드리겠습니다.",
      };
    }
  }

  async classifyComplaint(request: ClassificationRequest): Promise<AIClassificationResult> {
    return this.classify(request.content, request.citizenName, request.organizationId);
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
        "교통/도로": ["traffic_team"],
        "건설/도로": ["construction_team"],
        "복지": ["welfare_team"],
        "세무/재정": ["finance_team"],
        "문화/체육": ["culture_team"],
        "교육": ["education_team"],
        "안전": ["safety_team"],
        "행정/민원": ["admin_team"],
        "칭찬/감사": ["general_team"],
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

  async generateReplyDraftWithTone(
    ticketContent: string,
    category: string,
    citizenName?: string,
    tonePrompt?: string
  ): Promise<string> {
    try {
      return await this.aiClient.generateReplyDraftWithTone(
        ticketContent, 
        category, 
        citizenName, 
        tonePrompt
      );
    } catch (error) {
      console.error("톤 조정 답변 초안 생성 실패:", error);
      return "답변 초안을 생성할 수 없습니다. 수동으로 작성해 주세요.";
    }
  }

  async generateDraftResponse(
    ticketContent: string,
    category: string,
    citizenName?: string
  ): Promise<string> {
    return this.generateReplyDraft(ticketContent, category, citizenName);
  }
}

// 기본 설정으로 분류기 인스턴스 생성
export function createClassifier(apiKey?: string): ComplaintClassifier {
  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  
  if (!key) {
    console.warn("Anthropic API 키가 설정되지 않았습니다. AI 기능이 제한됩니다.");
  }

  return new ComplaintClassifier(key);
}