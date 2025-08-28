import { prisma, NotificationChannel, NotificationStatus, NotificationType } from "@myapp/prisma";
import { SMSClient } from "./clients/sms-client";
import { EmailClient } from "./clients/email-client";
import type { NotificationPayload, NotificationResult, NotificationConfig } from "./types";

export class NotificationService {
  private smsClient: SMSClient | null = null;
  private emailClient: EmailClient | null = null;
  private config: NotificationConfig;

  constructor(config?: Partial<NotificationConfig>) {
    this.config = {
      sms: {
        apiKey: config?.sms?.apiKey || process.env.SMS_TO_API_KEY || "",
        senderId: config?.sms?.senderId || process.env.SMS_TO_SENDER_ID || "",
        baseUrl: config?.sms?.baseUrl || process.env.SMS_TO_BASE_URL || "",
      },
      email: {
        apiKey: config?.email?.apiKey || process.env.SENDGRID_API_KEY || "",
        fromEmail: config?.email?.fromEmail || process.env.SENDGRID_FROM_EMAIL || "noreply@civicaid.com",
        fromName: config?.email?.fromName || "CivicAid",
      },
      kakao: config?.kakao,
    };

    // Initialize clients
    if (this.config.sms.apiKey) {
      this.smsClient = new SMSClient(this.config.sms);
    }
    if (this.config.email.apiKey) {
      this.emailClient = new EmailClient(this.config.email);
    }
  }

  async queueNotification(payload: NotificationPayload): Promise<string> {
    const preferredChannel = this.determineChannel(payload);
    const recipient = payload.recipientEmail || payload.recipientPhone || "unknown";
    
    const queue = await prisma.notificationQueue.create({
      data: {
        ticketId: payload.ticketId,
        type: this.mapNotificationType(payload.type),
        channel: preferredChannel,
        recipient,
        payload: {
          recipientName: payload.recipientName,
          recipientPhone: payload.recipientPhone,
          recipientEmail: payload.recipientEmail,
          templateData: payload.templateData,
        },
        status: "PENDING",
      },
    });

    // Immediately attempt to send
    await this.processNotification(queue.id);
    
    return queue.id;
  }

  async processNotification(queueId: string): Promise<void> {
    const queue = await prisma.notificationQueue.findUnique({
      where: { id: queueId },
    });

    if (!queue || queue.status !== "PENDING") {
      return;
    }

    // Update attempts
    await prisma.notificationQueue.update({
      where: { id: queueId },
      data: { 
        attemptCount: { increment: 1 },
        lastAttemptAt: new Date()
      },
    });

    // Extract payload data
    const payloadData = queue.payload as any;
    
    // Try preferred channel first
    let result = await this.sendViaChannel(queue.channel, {
      ticketId: queue.ticketId,
      type: this.reverseMapNotificationType(queue.type),
      recipientName: payloadData.recipientName,
      recipientPhone: payloadData.recipientPhone || undefined,
      recipientEmail: payloadData.recipientEmail || undefined,
      templateData: payloadData.templateData as Record<string, any>,
    });

    // If preferred channel fails, try fallback
    if (!result.success) {
      const fallbackChannel = this.getFallbackChannel(queue.channel);
      if (fallbackChannel) {
        result = await this.sendViaChannel(fallbackChannel, {
          ticketId: queue.ticketId,
          type: this.reverseMapNotificationType(queue.type),
          recipientName: payloadData.recipientName,
          recipientPhone: payloadData.recipientPhone || undefined,
          recipientEmail: payloadData.recipientEmail || undefined,
          templateData: payloadData.templateData as Record<string, any>,
        });
      }
    }

    // TODO: Add proper notification logging when notificationLog table is available
    // For now, log to console
    console.log(`Notification attempt for ${queue.id}:`, {
      channel: result.channel,
      success: result.success,
      error: result.error,
    });

    // Update queue status
    if (result.success) {
      await prisma.notificationQueue.update({
        where: { id: queueId },
        data: {
          status: "SENT",
          channel: result.channel,
          sentAt: new Date(),
        },
      });
    } else if (queue.attemptCount >= 2) { // Max 3 attempts (0-indexed)
      await prisma.notificationQueue.update({
        where: { id: queueId },
        data: {
          status: "FAILED",
          error: result.error,
        },
      });
    }
  }

  private async sendViaChannel(
    channel: NotificationChannel,
    payload: NotificationPayload
  ): Promise<NotificationResult> {
    switch (channel) {
      case "SMS":
        if (this.smsClient && this.smsClient.isAvailable()) {
          return await this.smsClient.send(payload);
        }
        return {
          success: false,
          channel: "SMS",
          error: "SMS client not available",
        };
      
      case "EMAIL":
        if (this.emailClient && this.emailClient.isAvailable()) {
          return await this.emailClient.send(payload);
        }
        return {
          success: false,
          channel: "EMAIL",
          error: "Email client not available",
        };
      
      case "KAKAO":
        // Kakao implementation would go here
        return {
          success: false,
          channel: "KAKAO",
          error: "Kakao client not implemented yet",
        };
      
      default:
        return {
          success: false,
          channel,
          error: `Unknown channel: ${channel}`,
        };
    }
  }

  private determineChannel(payload: NotificationPayload): NotificationChannel {
    // Priority: Kakao > SMS > Email
    // But for MVP, we'll use SMS as primary since Kakao requires approval
    
    if (payload.preferredChannel) {
      return payload.preferredChannel;
    }

    // Check what contact info we have
    if (payload.recipientPhone) {
      return "SMS";
    }
    if (payload.recipientEmail) {
      return "EMAIL";
    }
    
    // Default fallback
    return "EMAIL";
  }

  private getFallbackChannel(channel: NotificationChannel): NotificationChannel | null {
    switch (channel) {
      case "KAKAO":
        return "SMS";
      case "SMS":
        return "EMAIL";
      case "EMAIL":
        return null; // No fallback for email
      default:
        return null;
    }
  }

  private mapNotificationType(type: string): NotificationType {
    const mapping: Record<string, NotificationType> = {
      "TICKET_RECEIVED": "RECEIPT_CONFIRMATION",
      "TICKET_ASSIGNED": "STATUS_UPDATE",
      "TICKET_REPLIED": "REPLY_SENT",
      "TICKET_CLOSED": "STATUS_UPDATE",
      "SLA_WARNING": "STATUS_UPDATE",
      "SATISFACTION_REQUEST": "SATISFACTION_REQUEST",
    };
    return mapping[type] || "STATUS_UPDATE";
  }

  private reverseMapNotificationType(type: NotificationType): string {
    const mapping: Record<NotificationType, string> = {
      "RECEIPT_CONFIRMATION": "TICKET_RECEIVED",
      "STATUS_UPDATE": "TICKET_ASSIGNED",
      "REPLY_SENT": "TICKET_REPLIED",
      "SATISFACTION_REQUEST": "SATISFACTION_REQUEST",
    };
    return mapping[type] || type;
  }

  async processPendingNotifications(): Promise<void> {
    const pendingNotifications = await prisma.notificationQueue.findMany({
      where: {
        status: "PENDING",
        attemptCount: { lt: 3 },
      },
      orderBy: {
        scheduledFor: "asc",
      },
      take: 10,
    });

    await Promise.allSettled(
      pendingNotifications.map((notification) =>
        this.processNotification(notification.id)
      )
    );
  }

  // Simple rate limiting helper
  private async canSendNotification(recipient: string): Promise<boolean> {
    const recentNotifications = await prisma.notificationQueue.count({
      where: {
        recipient,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
    });

    return recentNotifications < 10; // Max 10 per hour
  }
}