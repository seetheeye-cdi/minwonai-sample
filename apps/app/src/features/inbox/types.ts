import type { TicketStatus, TicketPriority } from "@myapp/prisma";

export interface TicketFilters {
  search: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedToId?: string;
  slaApproaching: boolean;
}

export interface TicketListItem {
  id: string;
  citizenName: string;
  content: string;
  category?: string | null;
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
