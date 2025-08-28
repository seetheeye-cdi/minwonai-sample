"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/utils/trpc/client";
import { Button } from "@myapp/ui/components/button";
import { Input } from "@myapp/ui/components/input";
import { Textarea } from "@myapp/ui/components/textarea";
import { Label } from "@myapp/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@myapp/ui/components/select";
import { Checkbox } from "@myapp/ui/components/checkbox";
import { Alert, AlertDescription } from "@myapp/ui/components/alert";
import { Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

const formSchema = z.object({
  citizenName: z.string().min(1, "이름을 입력해주세요").max(50),
  citizenPhone: z.string()
    .min(10, "올바른 전화번호를 입력해주세요")
    .max(20)
    .regex(/^[0-9-]+$/, "전화번호는 숫자와 하이픈만 입력 가능합니다"),
  citizenEmail: z.string().email("올바른 이메일을 입력해주세요").optional().or(z.literal("")),
  content: z.string()
    .min(10, "내용은 최소 10자 이상 입력해주세요")
    .max(4000, "내용은 4000자를 초과할 수 없습니다"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  nickname: z.string().max(30).optional(),
  isPublic: z.boolean().default(true),
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: "개인정보 처리 동의가 필요합니다",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface TicketSubmitFormProps {
  onSuccess?: (publicToken: string) => void;
  onCancel?: () => void;
}

const CATEGORIES = [
  { value: "traffic", label: "교통/주차" },
  { value: "environment", label: "환경/청소" },
  { value: "construction", label: "건설/도로" },
  { value: "welfare", label: "복지/보건" },
  { value: "safety", label: "안전/치안" },
  { value: "culture", label: "문화/관광" },
  { value: "economy", label: "경제/일자리" },
  { value: "education", label: "교육" },
  { value: "other", label: "기타" },
];

export function TicketSubmitForm({ onSuccess, onCancel }: TicketSubmitFormProps) {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPublic: true,
      agreedToTerms: false,
    },
  });

  const selectedCategory = watch("category");
  const contentLength = watch("content")?.length || 0;

  // For public community, use a default organization ID
  // In production, this should be configured per deployment
  const defaultOrgId = "org_default_community";

  const createTicketMutation = trpc.community.createPublicTicket.useMutation({
    onSuccess: (data) => {
      toast.success("민원이 성공적으로 접수되었습니다!");
      if (onSuccess) {
        onSuccess(data.publicToken);
      }
      // Navigate to timeline page
      router.push(`/timeline/${data.publicToken}`);
    },
    onError: (error) => {
      toast.error(error.message || "민원 접수 중 오류가 발생했습니다.");
    },
  });

  const onSubmit = async (data: FormData) => {
    await createTicketMutation.mutateAsync({
      ...data,
      organizationId: defaultOrgId,
      citizenEmail: data.citizenEmail || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="citizenName">
            이름 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="citizenName"
            {...register("citizenName")}
            placeholder="홍길동"
            disabled={isSubmitting}
          />
          {errors.citizenName && (
            <p className="text-sm text-red-500">{errors.citizenName.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="citizenPhone">
            전화번호 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="citizenPhone"
            {...register("citizenPhone")}
            placeholder="010-1234-5678"
            disabled={isSubmitting}
          />
          {errors.citizenPhone && (
            <p className="text-sm text-red-500">{errors.citizenPhone.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="citizenEmail">이메일 (선택)</Label>
          <Input
            id="citizenEmail"
            type="email"
            {...register("citizenEmail")}
            placeholder="example@email.com"
            disabled={isSubmitting}
          />
          {errors.citizenEmail && (
            <p className="text-sm text-red-500">{errors.citizenEmail.message}</p>
          )}
        </div>

        {/* Nickname */}
        <div className="space-y-2">
          <Label htmlFor="nickname">닉네임 (선택)</Label>
          <Input
            id="nickname"
            {...register("nickname")}
            placeholder="익명으로 표시됩니다"
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500">
            입력하지 않으면 '익명'으로 표시됩니다
          </p>
        </div>

        {/* Category */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="category">
            카테고리 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => setValue("category", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="카테고리를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">
            민원 내용 <span className="text-red-500">*</span>
          </Label>
          <span className="text-sm text-gray-500">
            {contentLength} / 4000
          </span>
        </div>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="민원 내용을 자세히 작성해주세요..."
          rows={8}
          disabled={isSubmitting}
          className="resize-none"
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      {/* Public checkbox */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="isPublic"
          checked={watch("isPublic")}
          onCheckedChange={(checked) => setValue("isPublic", checked as boolean)}
          disabled={isSubmitting}
        />
        <div className="space-y-1">
          <Label htmlFor="isPublic" className="text-sm font-normal cursor-pointer">
            다른 시민들에게 공개
          </Label>
          <p className="text-xs text-gray-500">
            체크하면 다른 시민들이 이 민원을 볼 수 있습니다 (개인정보는 자동 마스킹)
          </p>
        </div>
      </div>

      {/* Terms agreement */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="agreedToTerms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => {
            setAgreedToTerms(checked as boolean);
            setValue("agreedToTerms", checked as boolean);
          }}
          disabled={isSubmitting}
        />
        <div className="space-y-1">
          <Label htmlFor="agreedToTerms" className="text-sm font-normal cursor-pointer">
            개인정보 수집 및 이용에 동의합니다 <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-gray-500">
            민원 처리를 위해 입력하신 개인정보를 수집하며, 처리 완료 후 안전하게 폐기됩니다.
          </p>
        </div>
      </div>
      {errors.agreedToTerms && (
        <p className="text-sm text-red-500">{errors.agreedToTerms.message}</p>
      )}

      {/* Submit buttons */}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-1" />
            취소
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !agreedToTerms}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              접수 중...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-1" />
              민원 접수
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
