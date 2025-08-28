# AI Ticket Classification Edge Function

This Supabase Edge Function automatically classifies incoming tickets using AI.

## Features

- Automatic category classification
- Sentiment analysis (POSITIVE, NEUTRAL, NEGATIVE)
- Priority assignment (LOW, NORMAL, HIGH, URGENT)
- AI-generated summary
- Draft response generation
- 10-second timeout protection
- Error handling with manual review flagging

## Setup

### 1. Environment Variables

Set the following environment variables in Supabase:

```bash
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Deploy the Function

```bash
supabase functions deploy classify-ticket
```

### 3. Create Database Webhook

In Supabase Dashboard:

1. Go to Database → Webhooks
2. Create a new webhook:
   - Name: `classify-new-tickets`
   - Table: `Ticket`
   - Events: `INSERT`
   - Method: `POST`
   - URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/classify-ticket`
   - Headers: Add `Authorization: Bearer YOUR_ANON_KEY`

## How It Works

1. When a new ticket is inserted with status `NEW`
2. The webhook triggers this Edge Function
3. The function calls OpenAI API to classify the ticket
4. Updates the ticket with:
   - Category
   - Sentiment
   - Priority
   - AI Summary
   - Confidence Score
   - Draft Answer (if confidence > 70%)
5. Changes status to `CLASSIFIED`
6. Creates an update log entry

## Error Handling

- If AI classification fails or times out (10s), the ticket is marked with:
  - `aiNeedsManualReview: true`
  - `aiErrorMessage: <error details>`
- The function returns 200 status to prevent webhook retries

## Categories

The AI classifies tickets into these categories:
- 환경/미화 (Environment/Sanitation)
- 교통 (Traffic)
- 건설/도로 (Construction/Roads)
- 복지 (Welfare)
- 세무/재정 (Tax/Finance)
- 문화/체육 (Culture/Sports)
- 교육 (Education)
- 안전 (Safety)
- 행정 (Administration)
- 기타 (Others)
