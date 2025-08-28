import type { 
  NotificationChannel, 
  NotificationStatus, 
  NotificationType 
} from "@myapp/prisma";

export interface NotificationConfig {
  sms: {
    apiKey: string;
    senderId: string;
    baseUrl: string;
  };
  email: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  kakao?: {
    apiKey: string;
    senderId: string;
    templateIds: Record<NotificationType, string>;
  };
}

export interface NotificationPayload {
  ticketId: string;
  type: NotificationType;
  recipientName: string;
  recipientPhone?: string;
  recipientEmail?: string;
  templateData: Record<string, any>;
  preferredChannel?: NotificationChannel;
}

export interface NotificationResult {
  success: boolean;
  channel: NotificationChannel;
  messageId?: string;
  error?: string;
  metadata?: any;
}

export interface ChannelClient {
  send(payload: NotificationPayload): Promise<NotificationResult>;
  isAvailable(): boolean;
}
