"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/utils/trpc/client";
import type { TicketFilters } from "../types";

export function useTickets(filters: TicketFilters) {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: async () => {
      // All filtering is now done server-side
      const result = await api.ticket.list.query({
        search: filters.search,
        status: filters.status,
        priority: filters.priority,
        sentiment: filters.sentiment,
        assignedToId: filters.assignedToId,
        slaApproaching: filters.slaApproaching,
        limit: 20,
      });
      
      return {
        tickets: result.tickets,
        total: result.total,
        hasMore: result.hasMore,
        nextCursor: result.nextCursor,
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for near real-time updates
  });
}

// Alternative: Infinite scrolling implementation
export function useInfiniteTickets(filters: TicketFilters) {
  return useInfiniteQuery({
    queryKey: ["tickets-infinite", filters],
    queryFn: async ({ pageParam }) => {
      const result = await api.ticket.list.query({
        search: filters.search,
        status: filters.status,
        priority: filters.priority,
        sentiment: filters.sentiment,
        assignedToId: filters.assignedToId,
        slaApproaching: filters.slaApproaching,
        cursor: pageParam,
        limit: 20,
      });
      
      return result;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}