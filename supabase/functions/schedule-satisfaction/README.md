# Schedule Satisfaction Survey Function

This Supabase Edge Function automatically schedules satisfaction survey notifications for tickets that were replied to 24 hours ago.

## Functionality

1. **Scans for eligible tickets**: Finds tickets with status `REPLIED` or `CLOSED` that were answered 23-24 hours ago
2. **Checks notification eligibility**: Ensures no duplicate satisfaction request has been sent
3. **Queues notifications**: Creates entries in NotificationQueue table for processing
4. **Updates tracking**: Marks channelSentAt timestamp in SatisfactionSurvey table

## Notification Priority

- **Primary**: SMS (if phone number available)
- **Secondary**: Email (if email available)
- **Skip**: If no contact information available

## Deployment

```bash
# Deploy the function
supabase functions deploy schedule-satisfaction

# Set environment variables in Supabase Dashboard
PUBLIC_APP_URL=https://your-app-url.com
```

## Scheduling

Set up a cron job in Supabase Dashboard to run this function periodically:

- **Recommended**: `*/5 * * * *` (every 5 minutes)
- **Alternative**: `0 * * * *` (every hour)

## Testing

```bash
# Local testing
supabase functions serve schedule-satisfaction --env-file=.env

# Invoke locally
curl -i --location --request POST \
  'http://localhost:54321/functions/v1/schedule-satisfaction' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json'
```

## Error Handling

- Duplicate notifications are prevented via unique constraint on `(ticketId, type)` in NotificationQueue
- Failed notifications are logged and can be retried
- Function is idempotent - safe to run multiple times

## Monitoring

Check function logs in Supabase Dashboard:
- Successful scheduling count
- Skipped tickets (no contact info)
- Any errors during processing

## Dependencies

- `@supabase/supabase-js`: Supabase client for database operations
- Deno runtime environment
