"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Textarea } from "@myapp/ui/components/textarea";
import { Label } from "@myapp/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@myapp/ui/components/radio-group";
import { Alert, AlertDescription } from "@myapp/ui/components/alert";
import { Star, Send, X, CheckCircle2 } from "lucide-react";
import { trpc } from "@/utils/trpc/client";
import { cn } from "@myapp/ui/lib/utils";
import { toast } from "sonner";

interface SatisfactionFormProps {
  ticketToken: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SatisfactionForm({ ticketToken, onSuccess, onCancel }: SatisfactionFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [quickFeedback, setQuickFeedback] = useState<string>("");

  const submitMutation = trpc.ticket.submitSatisfactionSurvey.useMutation({
    onSuccess: () => {
      toast.success("만족도 평가가 제출되었습니다. 감사합니다!");
      onSuccess?.();
    },
    onError: (error) => {
      if (error.message.includes("already submitted")) {
        toast.error("이미 만족도 평가를 제출하셨습니다.");
      } else {
        toast.error("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("만족도 점수를 선택해주세요.");
      return;
    }

    const finalFeedback = quickFeedback
      ? `${getQuickFeedbackText(quickFeedback)}${feedback ? `\n\n추가 의견: ${feedback}` : ""}`
      : feedback;

    submitMutation.mutate({
      ticketToken,
      rating,
      feedback: finalFeedback || undefined,
    });
  };

  const getQuickFeedbackText = (value: string) => {
    const feedbackMap: Record<string, string> = {
      fast: "빠른 처리에 만족합니다",
      kind: "친절한 응대에 감사드립니다",
      accurate: "정확한 답변을 받았습니다",
      slow: "처리 속도가 느렸습니다",
      unclear: "답변이 명확하지 않았습니다",
      unsatisfied: "전반적으로 불만족스럽습니다",
    };
    return feedbackMap[value] || value;
  };

  const getRatingLabel = (rating: number) => {
    const labels = ["", "매우 불만족", "불만족", "보통", "만족", "매우 만족"];
    return labels[rating] || "";
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return "text-red-500";
    if (rating === 3) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>만족도 평가</CardTitle>
          {onCancel && (
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription>민원 처리에 대한 만족도를 평가해주세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div>
          <Label className="text-base mb-3 block">전반적인 만족도</Label>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none focus:scale-110"
                  aria-label={`${star}점`}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      (hoveredRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    )}
                  />
                </button>
              ))}
            </div>
            {(rating > 0 || hoveredRating > 0) && (
              <span className={cn("ml-2 font-medium", getRatingColor(hoveredRating || rating))}>
                {getRatingLabel(hoveredRating || rating)}
              </span>
            )}
          </div>
        </div>

        {/* Quick Feedback Options */}
        <div>
          <Label className="text-base mb-3 block">빠른 피드백 (선택)</Label>
          <RadioGroup value={quickFeedback} onValueChange={setQuickFeedback}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rating >= 4 ? (
                <>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fast" id="fast" />
                    <Label htmlFor="fast" className="cursor-pointer">
                      빠른 처리에 만족합니다
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kind" id="kind" />
                    <Label htmlFor="kind" className="cursor-pointer">
                      친절한 응대에 감사드립니다
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="accurate" id="accurate" />
                    <Label htmlFor="accurate" className="cursor-pointer">
                      정확한 답변을 받았습니다
                    </Label>
                  </div>
                </>
              ) : rating > 0 && rating <= 3 ? (
                <>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="slow" id="slow" />
                    <Label htmlFor="slow" className="cursor-pointer">
                      처리 속도가 느렸습니다
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unclear" id="unclear" />
                    <Label htmlFor="unclear" className="cursor-pointer">
                      답변이 명확하지 않았습니다
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unsatisfied" id="unsatisfied" />
                    <Label htmlFor="unsatisfied" className="cursor-pointer">
                      전반적으로 불만족스럽습니다
                    </Label>
                  </div>
                </>
              ) : null}
            </div>
          </RadioGroup>
        </div>

        {/* Additional Feedback */}
        <div>
          <Label htmlFor="feedback" className="text-base mb-3 block">
            추가 의견 (선택)
          </Label>
          <Textarea
            id="feedback"
            placeholder="서비스 개선을 위한 의견을 자유롭게 작성해주세요..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {feedback.length}/500자
          </p>
        </div>

        {/* Privacy Notice */}
        <Alert>
          <AlertDescription className="text-sm">
            제출하신 평가는 서비스 개선을 위해서만 사용되며, 개인정보는 안전하게 보호됩니다.
          </AlertDescription>
        </Alert>

        {/* Submit Button */}
        <div className="flex gap-3">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={submitMutation.isPending}>
              취소
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || submitMutation.isPending}
            className="flex-1"
          >
            {submitMutation.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                제출 중...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                평가 제출하기
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
