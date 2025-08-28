"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Input } from "@myapp/ui/components/input";
import { Textarea } from "@myapp/ui/components/textarea";
import { Label } from "@myapp/ui/components/label";
import { Skeleton } from "@myapp/ui/components/skeleton";
import { MessageSquare, Send, User } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "sonner";

interface CommentSectionProps {
  publicToken: string;
}

export function CommentSection({ publicToken }: CommentSectionProps) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, refetch } = trpc.community.getComments.useQuery(
    { publicToken, limit: 20, offset: 0 },
    { refetchInterval: 30000 }
  );

  const addCommentMutation = trpc.community.addComment.useMutation({
    onSuccess: () => {
      toast.success("댓글이 등록되었습니다!");
      setContent("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "댓글 등록 중 오류가 발생했습니다.");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("댓글 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    await addCommentMutation.mutateAsync({
      publicToken,
      nickname: nickname.trim() || "익명",
      content: content.trim(),
    });
  };

  if (isLoading) {
    return <CommentSectionSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          댓글 ({data?.total || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment form */}
        <form onSubmit={handleSubmit} className="space-y-3 border-b pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="nickname" className="text-sm">
                닉네임
              </Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="익명"
                maxLength={30}
                disabled={isSubmitting}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label htmlFor="comment" className="text-sm">
                댓글 내용
              </Label>
              <div className="flex gap-2">
                <Textarea
                  id="comment"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="댓글을 입력해주세요..."
                  rows={2}
                  maxLength={500}
                  disabled={isSubmitting}
                  className="resize-none"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !content.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            댓글은 공개되며, 부적절한 내용은 삭제될 수 있습니다.
          </p>
        </form>

        {/* Comments list */}
        {data?.comments && data.comments.length > 0 ? (
          <div className="space-y-3">
            {data.comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50"
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.nickname}</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.createdAt), "MM.dd HH:mm", { locale: ko })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}

            {data.hasMore && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm">
                  더 보기
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              첫 번째 댓글을 작성해보세요!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CommentSectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
