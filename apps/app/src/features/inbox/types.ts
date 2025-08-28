import type { TicketStatus, TicketPriority, Sentiment } from "@myapp/prisma";

export interface TicketFilters {
  search: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  sentiment?: Sentiment;
  assignedToId?: string;
  slaApproaching: boolean;
}

export interface TicketListItem {
  id: string;
  citizenName: string;
  content: string;
  category?: string | null;
  sentiment?: Sentiment | null;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: {
    id: string;
    username: string | null;
    email: string;
  } | null;
  createdAt: Date;
  slaDueAt?: Date | null;
  _count: {
    updates: number;
  };
}
