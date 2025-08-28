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
    
    const queue = await prisma.notificationQueue.create({
      data: {
        ticketId: payload.ticketId,
        type: payload.type,
        recipientName: payload.recipientName,
        recipientPhone: payload.recipientPhone,
        recipientEmail: payload.recipientEmail,
        templateData: payload.templateData,
        preferredChannel,
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
      include: { ticket: true },
    });

    if (!queue || queue.status !== "PENDING") {
      return;
    }

    // Update attempts
    await prisma.notificationQueue.update({
      where: { id: queueId },
      data: { attempts: { increment: 1 } },
    });

    // Try preferred channel first
    let result = await this.sendViaChannel(queue.preferredChannel, {
      ticketId: queue.ticketId,
      type: queue.type as NotificationType,
      recipientName: queue.recipientName,
      recipientPhone: queue.recipientPhone || undefined,
      recipientEmail: queue.recipientEmail || undefined,
      templateData: queue.templateData as Record<string, any>,
    });

    // If preferred channel fails, try fallback
    if (!result.success) {
      const fallbackChannel = this.getFallbackChannel(queue.preferredChannel);
      if (fallbackChannel) {
        result = await this.sendViaChannel(fallbackChannel, {
          ticketId: queue.ticketId,
          type: queue.type as NotificationType,
          recipientName: queue.recipientName,
          recipientPhone: queue.recipientPhone || undefined,
          recipientEmail: queue.recipientEmail || undefined,
          templateData: queue.templateData as Record<string, any>,
        });
      }
    }

    // Log the attempt
    await prisma.notificationLog.create({
      data: {
        queueId,
        channel: result.channel,
        status: result.success ? "SENT" : "FAILED",
        attemptNumber: queue.attempts + 1,
        sentAt: new Date(),
        responseAt: new Date(),
        requestData: queue.templateData,
        responseData: result.metadata || null,
        errorMessage: result.error || null,
      },
    });

    // Update queue status
    if (result.success) {
      await prisma.notificationQueue.update({
        where: { id: queueId },
        data: {
          status: "SENT",
          currentChannel: result.channel,
          sentAt: new Date(),
          metadata: result.metadata || null,
        },
      });
    } else if (queue.attempts >= queue.maxAttempts - 1) {
      await prisma.notificationQueue.update({
        where: { id: queueId },
        data: {
          status: "FAILED",
          failedAt: new Date(),
          errorMessage: result.error,
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

  async processPendingNotifications(): Promise<void> {
    const pendingNotifications = await prisma.notificationQueue.findMany({
      where: {
        status: "PENDING",
        attempts: { lt: 3 },
        scheduledAt: { lte: new Date() },
      },
      orderBy: { scheduledAt: "asc" },
      take: 10,
    });

    for (const notification of pendingNotifications) {
      await this.processNotification(notification.id);
    }
  }
}
