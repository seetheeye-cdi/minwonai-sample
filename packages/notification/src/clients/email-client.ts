import sgMail from "@sendgrid/mail";
import type { ChannelClient, NotificationPayload, NotificationResult } from "../types";

export class EmailClient implements ChannelClient {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor(config: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  }) {
    this.apiKey = config.apiKey;
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;

    if (this.apiKey) {
      sgMail.setApiKey(this.apiKey);
    }
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.fromEmail);
  }

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    if (!payload.recipientEmail) {
      return {
        success: false,
        channel: "EMAIL",
        error: "No email address provided",
      };
    }

    try {
      const { subject, html, text } = this.formatEmail(payload);
      
      const msg = {
        to: payload.recipientEmail,
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject,
        text,
        html,
      };

      const [response] = await sgMail.send(msg);

      return {
        success: true,
        channel: "EMAIL",
        messageId: response.headers["x-message-id"],
        metadata: { statusCode: response.statusCode },
      };
    } catch (error: any) {
      console.error("Email send error:", error);
      return {
        success: false,
        channel: "EMAIL",
        error: error.message,
        metadata: error.response?.body,
      };
    }
  }

  private formatEmail(payload: NotificationPayload): { subject: string; html: string; text: string } {
    const { type, templateData, recipientName } = payload;
    
    let subject = "";
    let content = "";
    
    switch (type) {
      case "TICKET_RECEIVED":
        subject = `[민원 접수] 접수번호 ${templateData.ticketId}`;
        content = `
          <h2>민원이 접수되었습니다</h2>
          <p>안녕하세요 ${recipientName}님,</p>
          <p>귀하의 민원이 정상적으로 접수되었습니다.</p>
          <p><strong>접수번호:</strong> ${templateData.ticketId}</p>
          <p><strong>접수일시:</strong> ${templateData.createdAt}</p>
          <p><strong>처리예정일:</strong> ${templateData.slaDueAt || "확인 중"}</p>
          <hr>
          <p><a href="${templateData.timelineUrl}" style="background-color: #2C4A7A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">진행상황 확인하기</a></p>
        `;
        break;
      
      case "TICKET_ASSIGNED":
        subject = `[담당자 배정] 민원이 담당자에게 배정되었습니다`;
        content = `
          <h2>담당자가 배정되었습니다</h2>
          <p>안녕하세요 ${recipientName}님,</p>
          <p>귀하의 민원이 담당자에게 배정되어 처리 중입니다.</p>
          <p><strong>담당부서:</strong> ${templateData.department || "민원실"}</p>
          <p><strong>담당자:</strong> ${templateData.assigneeName || "담당자"}</p>
          <hr>
          <p><a href="${templateData.timelineUrl}" style="background-color: #2C4A7A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">진행상황 확인하기</a></p>
        `;
        break;
      
      case "TICKET_REPLIED":
        subject = `[답변 완료] 민원에 대한 답변이 등록되었습니다`;
        content = `
          <h2>답변이 등록되었습니다</h2>
          <p>안녕하세요 ${recipientName}님,</p>
          <p>귀하의 민원에 대한 답변이 등록되었습니다.</p>
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p><strong>답변 내용:</strong></p>
            <p>${templateData.replyText || "답변 내용을 확인하려면 아래 링크를 클릭해주세요."}</p>
          </div>
          <hr>
          <p><a href="${templateData.timelineUrl}" style="background-color: #2C4A7A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">전체 답변 확인하기</a></p>
        `;
        break;
      
      case "TICKET_CLOSED":
        subject = `[처리 완료] 민원이 처리 완료되었습니다`;
        content = `
          <h2>민원 처리가 완료되었습니다</h2>
          <p>안녕하세요 ${recipientName}님,</p>
          <p>귀하의 민원이 처리 완료되었습니다.</p>
          <p>민원 처리에 관심을 가져주셔서 감사합니다.</p>
          <hr>
          <p><a href="${templateData.timelineUrl}" style="background-color: #2C4A7A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">처리 결과 확인하기</a></p>
        `;
        break;
      
      case "SLA_WARNING":
        subject = `[처리 지연 안내] 민원 처리가 지연되고 있습니다`;
        content = `
          <h2>처리 지연 안내</h2>
          <p>안녕하세요 ${recipientName}님,</p>
          <p>귀하의 민원 처리가 예정보다 지연되고 있습니다.</p>
          <p>불편을 드려 죄송합니다. 최대한 빠른 시일 내에 처리하도록 하겠습니다.</p>
          <p><strong>예상 처리일:</strong> ${templateData.expectedDate || "확인 중"}</p>
          <hr>
          <p><a href="${templateData.timelineUrl}" style="background-color: #2C4A7A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">진행상황 확인하기</a></p>
        `;
        break;
      
      case "SATISFACTION_REQUEST":
        subject = `[만족도 조사] 민원 처리 만족도를 평가해주세요`;
        content = `
          <h2>만족도 조사</h2>
          <p>안녕하세요 ${recipientName}님,</p>
          <p>민원 처리가 완료되었습니다. 서비스 개선을 위해 만족도 조사에 참여해주세요.</p>
          <p>소중한 의견은 더 나은 서비스를 제공하는데 큰 도움이 됩니다.</p>
          <hr>
          <p><a href="${templateData.surveyUrl}" style="background-color: #1CBCB2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">만족도 평가하기</a></p>
        `;
        break;
      
      default:
        subject = "[민원 알림] 새로운 알림이 있습니다";
        content = `
          <h2>민원 알림</h2>
          <p>안녕하세요 ${recipientName}님,</p>
          <p>민원 관련 새로운 알림이 있습니다.</p>
        `;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h2 { color: #2C4A7A; }
          hr { border: none; border-top: 1px solid #e5e5e5; margin: 30px 0; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          ${content}
          <div class="footer">
            <p>본 메일은 발신전용입니다. 문의사항은 민원실로 연락해주세요.</p>
            <p>© 2024 CivicAid. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

    return { subject, html, text };
  }
}
