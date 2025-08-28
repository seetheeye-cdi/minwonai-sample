import OpenAI from "openai";
import { AIServiceConfig } from "./types";

export class AIClient {
  private openai: OpenAI;
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: config.apiKey,
      timeout: config.timeout,
    });
  }

  async classifyComplaint(content: string, citizenName?: string): Promise<any> {
    const systemPrompt = `당신은 한국의 지방자치단체 민원 분류 전문가입니다. 
민원 내용을 분석하여 다음 정보를 JSON 형태로 제공해주세요:

1. category: 다음 카테고리 중 하나를 선택
   - "환경/미화" (쓰레기, 청소, 환경오염 관련)
   - "교통" (도로, 주차, 교통신호 관련)
   - "건설/도로" (도로공사, 건축허가 관련)
   - "복지" (사회복지, 보건 관련)
   - "세무/재정" (세금, 요금 관련)
   - "문화/체육" (문화시설, 체육시설 관련)
   - "교육" (교육시설, 학교 관련)
   - "안전" (치안, 소방, 재해 관련)
   - "행정" (민원서류, 증명서 관련)
   - "기타" (위 카테고리에 해당하지 않는 경우)

2. sentiment: 민원인의 감정 상태
   - "POSITIVE": 긍정적, 감사 표현
   - "NEUTRAL": 중립적, 단순 문의
   - "NEGATIVE": 부정적, 불만 표현

3. priority: 우선순위 (감정과 내용의 긴급성 고려)
   - "LOW": 일반적인 문의, 긍정적 감정
   - "NORMAL": 보통 수준의 민원
   - "HIGH": 부정적 감정이나 시급한 문제
   - "URGENT": 매우 시급하거나 심각한 문제

4. confidence: 분류 신뢰도 (0.0-1.0)
5. summary: 민원 내용을 2-3문장으로 요약

응답은 반드시 유효한 JSON 형태여야 합니다.`;

    const userPrompt = `민원인: ${citizenName || "익명"}
민원 내용: ${content}

위 민원을 분석하여 JSON으로 분류해주세요.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: "json_object" },
      });

      const content_response = response.choices[0]?.message?.content;
      if (!content_response) {
        throw new Error("AI 응답이 비어있습니다.");
      }

      return JSON.parse(content_response);
    } catch (error) {
      console.error("AI 분류 오류:", error);
      throw error;
    }
  }

  async generateReplyDraft(
    ticketContent: string,
    category: string,
    citizenName?: string
  ): Promise<string> {
    const systemPrompt = `당신은 한국의 지방자치단체 민원 담당자입니다. 
시민의 민원에 대해 정중하고 전문적인 답변 초안을 작성해주세요.

답변 작성 원칙:
1. 정중하고 공손한 어조 사용
2. 구체적이고 실용적인 정보 제공
3. 필요시 관련 부서나 연락처 안내
4. 처리 절차나 소요 시간 명시
5. 추가 문의 방법 안내

답변은 한국어로 작성하며, 200-300자 내외로 작성해주세요.`;

    const userPrompt = `카테고리: ${category}
민원인: ${citizenName || "시민"}
민원 내용: ${ticketContent}

위 민원에 대한 답변 초안을 작성해주세요.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 400,
      });

      return response.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("답변 초안 생성 오류:", error);
      throw error;
    }
  }
}
