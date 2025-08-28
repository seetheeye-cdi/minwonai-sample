import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SMS_TO_API_KEY = Deno.env.get("SMS_TO_API_KEY");
const SMS_TO_SENDER_ID = Deno.env.get("SMS_TO_SENDER_ID") || "minwonai";
const SMS_TO_BASE_URL = Deno.env.get("SMS_TO_BASE_URL") || "https://api.sms.to";
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const SENDGRID_FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL") || "noreply@civicaid.com";
const APP_URL = Deno.env.get("NEXT_PUBLIC_APP_URL") || "https://civicaid.com";

interface NotificationQueue {
  id: string;
  ticketId: string;
  type: string;
  recipientPhone?: string;
  recipientEmail?: string;
  recipientName: string;
  templateData: any;
  preferredChannel: string;
  currentChannel?: string;
  status: string;
  attempts: number;
  maxAttempts: number;
}

async function sendSMS(phone: string, message: string) {
  if (!SMS_TO_API_KEY) {
    throw new Error("SMS_TO_API_KEY not configured");
  }

  const response = await fetch(`${SMS_TO_BASE_URL}/sms/send`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SMS_TO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: phone,
      message: message,
      sender_id: SMS_TO_SENDER_ID,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SMS send failed: ${error}`);
  }

  return await response.json();
}

async function sendEmail(to: string, subject: string, html: string, text: string) {
  if (!SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY not configured");
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: SENDGRID_FROM_EMAIL, name: "CivicAid" },
      subject,
      content: [
        { type: "text/plain", value: text },
        { type: "text/html", value: html },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Email send failed: ${error}`);
  }

  return { success: true, messageId: response.headers.get("x-message-id") };
}

function formatSMSMessage(type: string, data: any): string {
  const timelineUrl = `${APP_URL}/timeline/${data.publicToken || ""}`;
  
  switch (type) {
    case "TICKET_RECEIVED":
      return `[민원 접수]\n안녕하세요 ${data.recipientName}님.\n민원이 정상적으로 접수되었습니다.\n접수번호: ${data.ticketId}\n\n진행상황: ${timelineUrl}`;
    
    case "TICKET_ASSIGNED":
      return `[담당자 배정]\n${data.recipientName}님의 민원이 담당자에게 배정되었습니다.\n\n진행상황: ${timelineUrl}`;
    
    case "TICKET_REPLIED":
      return `[답변 완료]\n${data.recipientName}님의 민원에 대한 답변이 등록되었습니다.\n\n답변 확인: ${timelineUrl}`;
    
    case "TICKET_CLOSED":
      return `[처리 완료]\n${data.recipientName}님의 민원이 처리 완료되었습니다.\n감사합니다.\n\n상세내용: ${timelineUrl}`;
    
    case "SLA_WARNING":
      return `[처리 지연 안내]\n${data.recipientName}님의 민원 처리가 지연되고 있습니다.\n빠른 시일 내에 처리하겠습니다.\n\n진행상황: ${timelineUrl}`;
    
    case "SATISFACTION_REQUEST":
      return `[만족도 조사]\n${data.recipientName}님, 민원 처리에 만족하셨나요?\n만족도 조사에 참여해주세요.\n\n참여하기: ${timelineUrl}`;
    
    default:
      return `안녕하세요 ${data.recipientName}님. 민원 관련 알림입니다.\n\n확인하기: ${timelineUrl}`;
  }
}

function formatEmailContent(type: string, data: any): { subject: string; html: string; text: string } {
  const timelineUrl = `${APP_URL}/timeline/${data.publicToken || ""}`;
  let subject = "";
  let content = "";
  
  switch (type) {
    case "TICKET_RECEIVED":
      subject = `[민원 접수] 접수번호 ${data.ticketId}`;
      content = `
        <h2>민원이 접수되었습니다</h2>
        <p>안녕하세요 ${data.recipientName}님,</p>
        <p>귀하의 민원이 정상적으로 접수되었습니다.</p>
        <p><strong>접수번호:</strong> ${data.ticketId}</p>
        <hr>
        <p><a href="${timelineUrl}" style="background-color: #2C4A7A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">진행상황 확인하기</a></p>
      `;
      break;
    
    case "TICKET_REPLIED":
      subject = `[답변 완료] 민원에 대한 답변이 등록되었습니다`;
      content = `
        <h2>답변이 등록되었습니다</h2>
        <p>안녕하세요 ${data.recipientName}님,</p>
        <p>귀하의 민원에 대한 답변이 등록되었습니다.</p>
        <hr>
        <p><a href="${timelineUrl}" style="background-color: #2C4A7A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">답변 확인하기</a></p>
      `;
      break;
    
    default:
      subject = "[민원 알림] 새로운 알림이 있습니다";
      content = `
        <h2>민원 알림</h2>
        <p>안녕하세요 ${data.recipientName}님,</p>
        <p>민원 관련 새로운 알림이 있습니다.</p>
        <hr>
        <p><a href="${timelineUrl}">확인하기</a></p>
      `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      ${content}
      <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e5e5;">
      <p style="font-size: 12px; color: #999;">
        본 메일은 발신전용입니다. 문의사항은 민원실로 연락해주세요.<br>
        © 2024 CivicAid. All rights reserved.
      </p>
    </body>
    </html>
  `;

  const text = content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

  return { subject, html, text };
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Fetch pending notifications
    const { data: notifications, error } = await supabase
      .from("NotificationQueue")
      .select("*")
      .eq("status", "PENDING")
      .lt("attempts", 3)
      .lte("scheduledAt", new Date().toISOString())
      .order("scheduledAt", { ascending: true })
      .limit(10);

    if (error) {
      console.error("Error fetching notifications:", error);
      return new Response("Error fetching notifications", { status: 500 });
    }

    if (!notifications || notifications.length === 0) {
      return new Response("No pending notifications", { status: 200 });
    }

    // Process each notification
    for (const notification of notifications) {
      await processNotification(supabase, notification);
    }

    return new Response(`Processed ${notifications.length} notifications`, { status: 200 });
  } catch (error) {
    console.error("Error processing notifications:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

async function processNotification(supabase: any, notification: NotificationQueue) {
  const { id, type, recipientPhone, recipientEmail, recipientName, templateData, preferredChannel, attempts } = notification;

  // Merge template data
  const data = { ...templateData, recipientName };

  // Update attempts
  await supabase
    .from("NotificationQueue")
    .update({ attempts: attempts + 1 })
    .eq("id", id);

  let success = false;
  let channel = preferredChannel;
  let errorMessage = null;
  let responseData = null;

  try {
    // Try preferred channel first
    if (channel === "SMS" && recipientPhone) {
      const message = formatSMSMessage(type, data);
      responseData = await sendSMS(recipientPhone, message);
      success = true;
    } else if (channel === "EMAIL" && recipientEmail) {
      const { subject, html, text } = formatEmailContent(type, data);
      responseData = await sendEmail(recipientEmail, subject, html, text);
      success = true;
    }

    // If preferred channel failed, try fallback
    if (!success) {
      if (recipientPhone && channel !== "SMS") {
        channel = "SMS";
        const message = formatSMSMessage(type, data);
        responseData = await sendSMS(recipientPhone, message);
        success = true;
      } else if (recipientEmail && channel !== "EMAIL") {
        channel = "EMAIL";
        const { subject, html, text } = formatEmailContent(type, data);
        responseData = await sendEmail(recipientEmail, subject, html, text);
        success = true;
      }
    }
  } catch (error) {
    errorMessage = error.message;
    console.error(`Failed to send notification ${id}:`, error);
  }

  // Log the attempt
  await supabase.from("NotificationLog").insert({
    queueId: id,
    channel,
    status: success ? "SENT" : "FAILED",
    attemptNumber: attempts + 1,
    sentAt: new Date().toISOString(),
    responseAt: new Date().toISOString(),
    requestData: data,
    responseData,
    errorMessage,
  });

  // Update queue status
  if (success) {
    await supabase
      .from("NotificationQueue")
      .update({
        status: "SENT",
        currentChannel: channel,
        sentAt: new Date().toISOString(),
        metadata: responseData,
      })
      .eq("id", id);
  } else if (attempts >= 2) {
    await supabase
      .from("NotificationQueue")
      .update({
        status: "FAILED",
        failedAt: new Date().toISOString(),
        errorMessage,
      })
      .eq("id", id);
  }
}
