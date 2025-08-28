import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  User,
  AlertCircle,
  FileText,
  ArrowRight,
} from "lucide-react";
import { cn } from "@myapp/ui/lib/utils";

interface TimelineItemProps {
  update: {
    id: string;
    updateType: string;
    content: any;
    replyText?: string | null;
    createdAt: string;
  };
  isLast: boolean;
}

export function TimelineItem({ update, isLast }: TimelineItemProps) {
  const getUpdateIcon = () => {
    switch (update.updateType) {
      case "STATUS_CHANGE":
        return <CheckCircle2 className="h-4 w-4" />;
      case "COMMENT":
        return <MessageSquare className="h-4 w-4" />;
      case "REPLY_SENT":
        return <MessageSquare className="h-4 w-4" />;
      case "ASSIGNMENT_CHANGE":
        return <User className="h-4 w-4" />;
      case "PRIORITY_CHANGE":
        return <AlertCircle className="h-4 w-4" />;
      case "CATEGORY_CHANGE":
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getUpdateColor = () => {
    switch (update.updateType) {
      case "STATUS_CHANGE":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "REPLY_SENT":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "ASSIGNMENT_CHANGE":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "PRIORITY_CHANGE":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getUpdateDescription = () => {
    const content = update.content || {};
    
    switch (update.updateType) {
      case "STATUS_CHANGE":
        const fromStatus = getStatusLabel(content.from);
        const toStatus = getStatusLabel(content.to);
        if (!content.from) {
          return `민원이 접수되었습니다`;
        }
        return (
          <span className="flex items-center gap-1 flex-wrap">
            <span>{fromStatus}</span>
            <ArrowRight className="h-3 w-3" />
            <span className="font-medium">{toStatus}</span>
          </span>
        );
      
      case "COMMENT":
        return content.message || "댓글이 추가되었습니다";
      
      case "REPLY_SENT":
        return "답변이 발송되었습니다";
      
      case "ASSIGNMENT_CHANGE":
        return `담당자가 ${content.assignee || "배정"}되었습니다`;
      
      case "PRIORITY_CHANGE":
        return (
          <span className="flex items-center gap-1 flex-wrap">
            우선순위 변경:
            <span>{content.from}</span>
            <ArrowRight className="h-3 w-3" />
            <span className="font-medium">{content.to}</span>
          </span>
        );
      
      case "CATEGORY_CHANGE":
        return `카테고리가 "${content.category}"로 변경되었습니다`;
      
      default:
        return content.message || "업데이트되었습니다";
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      NEW: "접수",
      CLASSIFIED: "분류",
      IN_PROGRESS: "처리중",
      REPLIED: "답변완료",
      CLOSED: "종료",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="flex gap-4">
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            getUpdateColor()
          )}
        >
          {getUpdateIcon()}
        </div>
        {!isLast && (
          <div className="absolute top-10 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
        )}
      </div>
      <div className="flex-1 pb-8">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {format(new Date(update.createdAt), "yyyy년 MM월 dd일 HH:mm", {
            locale: ko,
          })}
        </p>
        <div className="text-gray-700 dark:text-gray-300">
          {getUpdateDescription()}
        </div>
        {update.replyText && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">{update.replyText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
