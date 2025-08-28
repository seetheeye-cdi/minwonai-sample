"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/trpc/client";
import type { TicketFilters } from "../types";

export function useTickets(filters: TicketFilters) {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: async () => {
      const result = await api.ticket.list.query({
        status: filters.status,
        priority: filters.priority,
        assignedToId: filters.assignedToId,
        limit: 20,
        offset: 0,
      });
      
      // Apply client-side search filter if needed
      let filteredTickets = result.tickets;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTickets = result.tickets.filter(ticket => 
          ticket.citizenName.toLowerCase().includes(searchLower) ||
          ticket.content.toLowerCase().includes(searchLower) ||
          ticket.category?.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply SLA approaching filter
      if (filters.slaApproaching) {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        filteredTickets = filteredTickets.filter(ticket => 
          ticket.slaDueAt && new Date(ticket.slaDueAt) <= tomorrow
        );
      }
      
      return {
        tickets: filteredTickets,
        total: filteredTickets.length,
        hasMore: false, // For now, we'll implement pagination later
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for near real-time updates
  });
}
