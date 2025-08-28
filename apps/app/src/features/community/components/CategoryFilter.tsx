"use client";

import { trpc } from "@/utils/trpc/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@myapp/ui/components/select";
import { Filter } from "lucide-react";

interface CategoryFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

const STATIC_CATEGORIES = [
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

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { data: dynamicCategories } = trpc.community.getCategories.useQuery();

  // Merge static and dynamic categories
  const allCategories = STATIC_CATEGORIES;

  return (
    <Select
      value={value || "all"}
      onValueChange={(val) => onChange(val === "all" ? undefined : val)}
    >
      <SelectTrigger className="w-[180px]">
        <Filter className="h-4 w-4 mr-2" />
        <SelectValue placeholder="카테고리 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">전체 카테고리</SelectItem>
        {allCategories.map((cat) => (
          <SelectItem key={cat.value} value={cat.value}>
            {cat.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
