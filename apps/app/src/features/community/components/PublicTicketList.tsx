"use client";

import { useEffect } from "react";
import { trpc } from "@/utils/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Badge } from "@myapp/ui/components/badge";
import { Button } from "@myapp/ui/components/button";
import { Skeleton } from "@myapp/ui/components/skeleton";
import { MessageSquare, ThumbsUp, Calendar, User, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@myapp/ui/lib/utils";

interface PublicTicketListProps {
  type: "recent" | "popular" | "replied";
  category?: string;
  refreshKey?: number;
}

export function PublicTicketList({ type, category, refreshKey }: PublicTicketListProps) {
  const router = useRouter();
  
  const { data, isLoading, refetch } = trpc.community.getPublicTickets.useQuery(
    {
      limit: 20,
      offset: 0,
      category,
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  useEffect(() => {
    refetch();
  }, [refreshKey, refetch]);

  // Filter based on type
  const filteredTickets = data?.tickets.filter(ticket => {
    switch (type) {
      case "popular":
        return ticket._count.likes > 0;
      case "replied":
        return ticket.status === "REPLIED" || ticket.status === "CLOSED";
      default:
        return true;
    }
  }) || [];

  // Sort based on type
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (type === "popular") {
      return b._count.likes - a._count.likes;
    }
    return 0; // Already sorted by createdAt from API
  });

  if (isLoading) {
    return <PublicTicketListSkeleton />;
  }

  if (!sortedTickets.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            {type === "popular" 
              ? "아직 인기 민원이 없습니다."
              : type === "replied"
              ? "답변 완료된 민원이 없습니다."
              : "등록된 민원이 없습니다."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTickets.map((ticket) => (
        <Card
          key={ticket.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push(`/timeline/${ticket.publicToken}`)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(ticket.category)}
                  </Badge>
                  <Badge
                    variant={getStatusVariant(ticket.status)}
                    className="text-xs"
                  >
                    {ticket.statusLabel}
                  </Badge>
                </div>
                <CardTitle className="text-base line-clamp-2">
                  {ticket.publicExcerpt}
                </CardTitle>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{ticket.nickname || "익명"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(ticket.createdAt), "MM.dd HH:mm", { locale: ko })}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{ticket._count.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{ticket._count.comments}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {data?.hasMore && (
        <div className="text-center py-4">
          <Button variant="outline" size="sm">
            더 보기
          </Button>
        </div>
      )}
    </div>
  );
}

function PublicTicketListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-5 w-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getCategoryLabel(category: string | null): string {
  const categoryMap: Record<string, string> = {
    traffic: "교통/주차",
    environment: "환경/청소",
    construction: "건설/도로",
    welfare: "복지/보건",
    safety: "안전/치안",
    culture: "문화/관광",
    economy: "경제/일자리",
    education: "교육",
    other: "기타",
  };
  return category ? (categoryMap[category] || category) : "미분류";
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "NEW":
    case "CLASSIFIED":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    case "REPLIED":
    case "CLOSED":
      return "outline";
    default:
      return "default";
  }
}
