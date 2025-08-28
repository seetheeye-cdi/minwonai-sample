// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// Setup type definitions for built-in Supabase Runtime APIs
import "https://raw.githubusercontent.com/supabase/functions-js/main/src/edge-runtime.d.ts"

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting satisfaction survey scheduling...')
    
    // Calculate time windows
    const now = new Date()
    const windowStart = new Date(now.getTime() - (24 * 60 * 60 * 1000)) // 24 hours ago
    const windowEnd = new Date(now.getTime() - (23 * 60 * 60 * 1000))   // 23 hours ago
    
    // Find tickets that were replied 24 hours ago and haven't received satisfaction request
    const { data: eligibleTickets, error: ticketsError } = await supabase
      .from('Ticket')
      .select(`
        id,
        citizenName,
        citizenPhone,
        citizenEmail,
        publicToken,
        repliedAt,
        survey:SatisfactionSurvey(
          id,
          channelSentAt
        )
      `)
      .in('status', ['REPLIED', 'CLOSED'])
      .gte('repliedAt', windowStart.toISOString())
      .lte('repliedAt', windowEnd.toISOString())
      .limit(100)
    
    if (ticketsError) {
      console.error('Error fetching eligible tickets:', ticketsError)
      throw ticketsError
    }
    
    console.log(`Found ${eligibleTickets?.length || 0} potentially eligible tickets`)
    
    const ticketsToNotify = eligibleTickets?.filter(ticket => 
      !ticket.survey?.[0]?.channelSentAt // No satisfaction request sent yet
    ) || []
    
    console.log(`${ticketsToNotify.length} tickets need satisfaction request`)
    
    // Queue notifications for each eligible ticket
    const notificationPromises = ticketsToNotify.map(async (ticket) => {
      // Determine notification channel priority: SMS > Email
      const channel = ticket.citizenPhone ? 'SMS' : ticket.citizenEmail ? 'EMAIL' : null
      const recipient = ticket.citizenPhone || ticket.citizenEmail
      
      if (!channel || !recipient) {
        console.log(`Skipping ticket ${ticket.id}: No contact information available`)
        return null
      }
      
      // Check for existing notification to prevent duplicates
      const { data: existingQueue, error: queueCheckError } = await supabase
        .from('NotificationQueue')
        .select('id')
        .eq('ticketId', ticket.id)
        .eq('type', 'SATISFACTION_REQUEST')
        .single()
      
      if (existingQueue) {
        console.log(`Notification already queued for ticket ${ticket.id}`)
        return null
      }
      
      // Prepare notification payload
      const payload = {
        ticketId: ticket.id,
        citizenName: ticket.citizenName,
        publicToken: ticket.publicToken,
        surveyUrl: `${Deno.env.get('PUBLIC_APP_URL')}/timeline/${ticket.publicToken}`,
        message: `안녕하세요, ${ticket.citizenName}님. 민원 처리 만족도 조사에 참여해주세요. 다음 링크에서 간단한 평가를 남겨주시면 서비스 개선에 큰 도움이 됩니다.`,
      }
      
      // Queue the notification
      const { data: queuedNotification, error: queueError } = await supabase
        .from('NotificationQueue')
        .insert({
          ticketId: ticket.id,
          type: 'SATISFACTION_REQUEST',
          channel,
          recipient,
          payload,
          scheduledFor: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (queueError) {
        console.error(`Failed to queue notification for ticket ${ticket.id}:`, queueError)
        return null
      }
      
      // Update survey record with channelSentAt
      if (ticket.survey?.[0]?.id) {
        await supabase
          .from('SatisfactionSurvey')
          .update({ channelSentAt: new Date().toISOString() })
          .eq('id', ticket.survey[0].id)
      } else {
        // Create survey record if not exists
        await supabase
          .from('SatisfactionSurvey')
          .insert({
            ticketId: ticket.id,
            rating: 0, // Will be updated when user submits
            channelSentAt: new Date().toISOString(),
          })
      }
      
      console.log(`Queued satisfaction request for ticket ${ticket.id} via ${channel}`)
      return queuedNotification
    })
    
    const results = await Promise.all(notificationPromises)
    const successCount = results.filter(r => r !== null).length
    
    const responseData = {
      success: true,
      message: `Scheduled ${successCount} satisfaction survey notifications`,
      stats: {
        eligibleTickets: eligibleTickets?.length || 0,
        notificationsQueued: successCount,
        windowStart: windowStart.toISOString(),
        windowEnd: windowEnd.toISOString(),
      },
    }
    
    console.log('Satisfaction survey scheduling completed:', responseData)
    
    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in satisfaction survey scheduling:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

/* To invoke this function:
  1. Run locally: supabase functions serve schedule-satisfaction --env-file=.env
  2. Deploy: supabase functions deploy schedule-satisfaction
  3. Test: curl -i --location --request POST 'http://localhost:54321/functions/v1/schedule-satisfaction' \
          --header 'Authorization: Bearer YOUR_ANON_KEY' \
          --header 'Content-Type: application/json'
  4. Schedule as cron job in Supabase Dashboard (e.g., */5 * * * * for every 5 minutes)
*/
