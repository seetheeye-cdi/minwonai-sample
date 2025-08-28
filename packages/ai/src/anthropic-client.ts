import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { 
  AIClassificationResult, 
  Sentiment,
  TicketPriority 
} from "./types";

const ClassificationSchema = z.object({
  category: z.string(),
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"]),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
  summary: z.string(),
  draftAnswer: z.string(),
  suggestedAssigneeEmail: z.string().email().optional(),
});

export class AnthropicClient {
  private client: Anthropic;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error("Anthropic API key is required");
    }
    
    this.client = new Anthropic({
      apiKey: key,
    });
  }

  async classifyComplaint(
    content: string,
    citizenName?: string
  ): Promise<AIClassificationResult> {
    try {
      const systemPrompt = `당신은 한국 지방자치단체의 민원 분류 전문가입니다. 
민원 내용을 분석하여 다음 정보를 JSON 형식으로 추출해주세요:

1. category: 민원 카테고리 (예: 교통/도로, 환경/미화, 건설/도로, 행정/민원, 문화/체육, 칭찬/감사 등)
2. sentiment: 감정 분석 (POSITIVE, NEUTRAL, NEGATIVE 중 하나)
3. priority: 우선순위 (LOW, NORMAL, HIGH, URGENT 중 하나)
   - URGENT: 즉시 처리 필요 (안전, 생명 위협)
   - HIGH: 빠른 처리 필요 (불편, 위험)
   - NORMAL: 일반적인 처리
   - LOW: 낮은 우선순위 (칭찬, 제안)
4. summary: 20자 이내의 간단한 요약
5. draftAnswer: 200-300자의 정중한 답변 초안
6. suggestedAssigneeEmail: 담당자 이메일 (선택사항)

응답은 반드시 JSON 형식이어야 합니다.`;

      const userPrompt = `민원인: ${citizenName || "시민"}
민원 내용: ${content}`;

      const response = await this.client.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const textContent = response.content[0];
      if (textContent.type !== "text") {
        throw new Error("Unexpected response type from Claude");
      }

      // Extract JSON from the response
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const validated = ClassificationSchema.parse(parsed);

      return {
        category: validated.category,
        sentiment: validated.sentiment as Sentiment,
        priority: validated.priority as TicketPriority,
        summary: validated.summary,
        draftAnswer: validated.draftAnswer,
        suggestedAssigneeEmail: validated.suggestedAssigneeEmail,
        confidenceScore: 0.9, // Claude doesn't provide confidence scores
      };
    } catch (error) {
      console.error("Anthropic classification error:", error);
      throw error;
    }
  }

  async generateReplyDraft(
    ticketContent: string,
    category: string,
    citizenName?: string,
    tonePrompt?: string
  ): Promise<string> {
    try {
      const systemPrompt = `당신은 한국의 지방자치단체 민원 담당자입니다. 
시민의 민원에 대해 정중하고 전문적인 답변 초안을 작성해주세요.
${tonePrompt ? `답변은 ${tonePrompt} 작성해주세요.` : ''}

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

      const response = await this.client.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 500,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const textContent = response.content[0];
      if (textContent.type !== "text") {
        throw new Error("Unexpected response type from Claude");
      }

      return textContent.text.trim();
    } catch (error) {
      console.error("Reply draft generation error:", error);
      throw error;
    }
  }

  async generateReplyDraftWithTone(
    ticketContent: string,
    category: string,
    citizenName?: string,
    tonePrompt?: string
  ): Promise<string> {
    return this.generateReplyDraft(ticketContent, category, citizenName, tonePrompt);
  }
}
