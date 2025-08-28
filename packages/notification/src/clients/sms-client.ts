import axios from "axios";
import type { ChannelClient, NotificationPayload, NotificationResult } from "../types";

export class SMSClient implements ChannelClient {
  private apiKey: string;
  private senderId: string;
  private baseUrl: string;

  constructor(config: {
    apiKey: string;
    senderId: string;
    baseUrl: string;
  }) {
    this.apiKey = config.apiKey;
    this.senderId = config.senderId;
    this.baseUrl = config.baseUrl;
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.senderId && this.baseUrl);
  }

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    if (!payload.recipientPhone) {
      return {
        success: false,
        channel: "SMS",
        error: "No phone number provided",
      };
    }

    try {
      const message = this.formatMessage(payload);
      
      const response = await axios.post(
        `${this.baseUrl}/sms/send`,
        {
          to: payload.recipientPhone,
          message: message,
          sender_id: this.senderId,
          callback_url: process.env.SMS_CALLBACK_URL,
        },
        {
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      return {
        success: response.data.success === true,
        channel: "SMS",
        messageId: response.data.message_id,
        metadata: response.data,
      };
    } catch (error: any) {
      console.error("SMS send error:", error);
      return {
        success: false,
        channel: "SMS",
        error: error.response?.data?.message || error.message,
        metadata: error.response?.data,
      };
    }
  }

  private formatMessage(payload: NotificationPayload): string {
    const { type, templateData } = payload;
    
    switch (type) {
      case "TICKET_RECEIVED":
        return `[민원 접수]\n안녕하세요 ${payload.recipientName}님.\n민원이 정상적으로 접수되었습니다.\n접수번호: ${templateData.ticketId}\n\n진행상황: ${templateData.timelineUrl}`;
      
      case "TICKET_ASSIGNED":
        return `[담당자 배정]\n${payload.recipientName}님의 민원이 담당자에게 배정되었습니다.\n담당부서: ${templateData.department || "민원실"}\n\n진행상황: ${templateData.timelineUrl}`;
      
      case "TICKET_REPLIED":
        return `[답변 완료]\n${payload.recipientName}님의 민원에 대한 답변이 등록되었습니다.\n\n답변 확인: ${templateData.timelineUrl}`;
      
      case "TICKET_CLOSED":
        return `[처리 완료]\n${payload.recipientName}님의 민원이 처리 완료되었습니다.\n감사합니다.\n\n상세내용: ${templateData.timelineUrl}`;
      
      case "SLA_WARNING":
        return `[처리 지연 안내]\n${payload.recipientName}님의 민원 처리가 지연되고 있습니다.\n빠른 시일 내에 처리하겠습니다.\n\n진행상황: ${templateData.timelineUrl}`;
      
      case "SATISFACTION_REQUEST":
        return `[만족도 조사]\n${payload.recipientName}님, 민원 처리에 만족하셨나요?\n만족도 조사에 참여해주세요.\n\n참여하기: ${templateData.surveyUrl}`;
      
      default:
        return `안녕하세요 ${payload.recipientName}님. 민원 관련 알림입니다.`;
    }
  }
}
