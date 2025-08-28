"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Badge } from "@myapp/ui/components/badge";
import { Button } from "@myapp/ui/components/button";
import { Separator } from "@myapp/ui/components/separator";
import { Progress } from "@myapp/ui/components/progress";
import { Alert, AlertDescription, AlertTitle } from "@myapp/ui/components/alert";
import { Skeleton } from "@myapp/ui/components/skeleton";
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  User,
  Calendar,
  FileText,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { SatisfactionForm } from "./components/SatisfactionForm";
import { TimelineItem } from "./components/TimelineItem";
import { cn } from "@myapp/ui/lib/utils";

interface TimelinePageProps {
  token: string;
}

export function TimelinePage({ token }: TimelinePageProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showSatisfactionForm, setShowSatisfactionForm] = useState(false);

  const { data: ticket, isLoading, error } = trpc.ticket.getByPublicToken.useQuery(
    { token },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  if (isLoading) {
    return <TimelinePageSkeleton />;
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              접근 오류
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              유효하지 않은 링크이거나 만료된 페이지입니다.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              민원 담당 부서에 문의해주세요.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusProgress = () => {
    switch (ticket.status) {
      case "NEW":
        return 20;
      case "CLASSIFIED":
        return 40;
      case "IN_PROGRESS":
        return 60;
      case "REPLIED":
        return 80;
      case "CLOSED":
        return 100;
      default:
        return 0;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      NEW: "접수 완료",
      CLASSIFIED: "분류 완료",
      IN_PROGRESS: "처리 중",
      REPLIED: "답변 완료",
      CLOSED: "종료",
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "NEW":
        return <FileText className="h-4 w-4" />;
      case "CLASSIFIED":
        return <User className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4" />;
      case "REPLIED":
        return <MessageSquare className="h-4 w-4" />;
      case "CLOSED":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const canSubmitSurvey = ticket.status === "REPLIED" || ticket.status === "CLOSED";
  const hasSurvey = Boolean(ticket.survey);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            민원 처리 진행상황
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            실시간으로 민원 처리 상태를 확인하실 수 있습니다
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">처리 진행률</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={getStatusProgress()} className="h-3 mb-4" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">접수</span>
              <span className="font-medium text-primary">
                {getStatusLabel(ticket.status)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">완료</span>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>민원 정보</CardTitle>
              <Badge
                variant={
                  ticket.status === "CLOSED"
                    ? "default"
                    : ticket.status === "REPLIED"
                    ? "secondary"
                    : "outline"
                }
                className="flex items-center gap-1"
              >
                {getStatusIcon(ticket.status)}
                {getStatusLabel(ticket.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  접수번호
                </p>
                <p className="font-medium">{ticket.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  접수일시
                </p>
                <p className="font-medium">
                  {format(new Date(ticket.createdAt), "yyyy년 MM월 dd일 HH:mm", {
                    locale: ko,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  민원인
                </p>
                <p className="font-medium">{ticket.citizenName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  카테고리
                </p>
                <p className="font-medium">{ticket.category || "미분류"}</p>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">민원 내용</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullContent(!showFullContent)}
                >
                  {showFullContent ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      접기
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      전체보기
                    </>
                  )}
                </Button>
              </div>
              <p
                className={cn(
                  "text-gray-700 dark:text-gray-300 whitespace-pre-wrap",
                  !showFullContent && "line-clamp-3"
                )}
              >
                {ticket.content}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>처리 이력</CardTitle>
            <CardDescription>민원 처리 과정을 시간순으로 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ticket.updates.map((update, index) => (
                <TimelineItem
                  key={update.id}
                  update={update}
                  isLast={index === ticket.updates.length - 1}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reply Section */}
        {ticket.updates.some((u) => u.updateType === "REPLY_SENT") && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                답변 내용
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.updates
                .filter((u) => u.updateType === "REPLY_SENT")
                .map((reply) => (
                  <div key={reply.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(reply.createdAt), "yyyy년 MM월 dd일 HH:mm", {
                        locale: ko,
                      })}
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                      <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {reply.replyText}
                      </p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Satisfaction Survey */}
        {canSubmitSurvey && !hasSurvey && !showSatisfactionForm && (
          <Alert className="mb-6">
            <Star className="h-4 w-4" />
            <AlertTitle>만족도 평가</AlertTitle>
            <AlertDescription className="mt-2">
              민원 처리에 대한 만족도를 평가해주세요. 더 나은 서비스를 제공하는데 큰 도움이
              됩니다.
              <Button
                className="mt-3 w-full sm:w-auto"
                onClick={() => setShowSatisfactionForm(true)}
              >
                만족도 평가하기
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {showSatisfactionForm && !hasSurvey && (
          <SatisfactionForm
            ticketToken={token}
            onSuccess={() => {
              setShowSatisfactionForm(false);
            }}
            onCancel={() => setShowSatisfactionForm(false)}
          />
        )}

        {hasSurvey && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                만족도 평가 완료
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                소중한 의견 감사합니다. 더 나은 서비스로 보답하겠습니다.
              </p>
              {ticket.survey && (
                <div className="mt-4 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-5 w-5",
                        star <= ticket.survey!.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    ({ticket.survey.rating}점)
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function TimelinePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 text-center">
          <Skeleton className="h-10 w-64 mx-auto mb-2" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-full mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
