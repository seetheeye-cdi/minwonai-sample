// Test notification service
const { NotificationService } = require('../packages/notification/dist');

// Set environment variables for testing
process.env.SMS_TO_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGg6ODA4MC9hcGkvdjEvdXNlcnMvYXBpL2tleXMvZ2VuZXJhdGUiLCJpYXQiOjE3NTYzNzEyMzksIm5iZiI6MTc1NjM3MTIzOSwianRpIjoiQmN4QnFBemtUWngwdTdXeSIsInN1YiI6NDg2ODI5LCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.ny4KjgvgvJso9DcHM7CPnCedngOEzrqM7L_8aTqOO7Y';
process.env.SMS_TO_SENDER_ID = 'minwonai';
process.env.SMS_TO_BASE_URL = 'https://api.sms.to';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3001';

async function testNotification() {
  console.log('🚀 Testing notification service...\n');

  const service = new NotificationService();

  // Test SMS notification
  const testPayload = {
    ticketId: 'test_ticket_001',
    type: 'TICKET_RECEIVED',
    recipientName: '테스트 사용자',
    recipientPhone: '+821012345678', // Replace with actual test phone
    recipientEmail: 'test@example.com',
    templateData: {
      ticketId: 'TEST-001',
      createdAt: new Date().toLocaleString('ko-KR'),
      timelineUrl: 'http://localhost:3001/timeline/test-token',
    },
  };

  try {
    console.log('📱 Testing SMS notification...');
    const result = await service.sendViaChannel('SMS', testPayload);
    console.log('SMS Result:', result);
    console.log('\n');
  } catch (error) {
    console.error('SMS Error:', error);
  }

  // Test Email notification (if configured)
  if (process.env.SENDGRID_API_KEY) {
    try {
      console.log('📧 Testing Email notification...');
      const result = await service.sendViaChannel('EMAIL', testPayload);
      console.log('Email Result:', result);
    } catch (error) {
      console.error('Email Error:', error);
    }
  } else {
    console.log('⚠️  SendGrid not configured, skipping email test');
  }

  console.log('\n✅ Test completed!');
}

testNotification().catch(console.error);
