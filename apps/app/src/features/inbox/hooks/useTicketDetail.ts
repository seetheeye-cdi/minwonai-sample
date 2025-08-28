import { trpc } from "@/utils/trpc/client";

export function useTicketDetail(ticketId: string) {
  return trpc.ticket.getById.useQuery(
    { id: ticketId },
    {
      enabled: !!ticketId,
      refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    }
  );
}
