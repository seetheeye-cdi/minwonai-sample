import { TicketDetailPage } from "@/features/inbox/TicketDetailPage";

export default function Page({ 
  params 
}: { 
  params: Promise<{ ticketId: string }> 
}) {
  return <TicketDetailPage params={params} />;
}
