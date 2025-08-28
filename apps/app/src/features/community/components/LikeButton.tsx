"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc/client";
import { Button } from "@myapp/ui/components/button";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@myapp/ui/lib/utils";

interface LikeButtonProps {
  publicToken: string;
  initialCount?: number;
  className?: string;
}

export function LikeButton({ publicToken, initialCount = 0, className }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialCount);

  const likeMutation = trpc.community.addLike.useMutation({
    onSuccess: () => {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      toast.success("좋아요를 눌렀습니다!");
    },
    onError: (error) => {
      if (error.message.includes("이미 좋아요")) {
        setLiked(true);
        toast.info("이미 좋아요를 누르셨습니다.");
      } else {
        toast.error(error.message || "오류가 발생했습니다.");
      }
    },
  });

  const handleLike = () => {
    if (liked) {
      toast.info("이미 좋아요를 누르셨습니다.");
      return;
    }
    likeMutation.mutate({ publicToken });
  };

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={handleLike}
      disabled={likeMutation.isPending}
      className={cn("gap-2", className)}
    >
      <ThumbsUp className={cn("h-4 w-4", liked && "fill-current")} />
      <span>{likeCount}</span>
    </Button>
  );
}
