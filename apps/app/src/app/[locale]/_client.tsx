"use client";

import { PlanSelectDialogProvider } from "@/features/subscription/components/PlanSelectDialog";
import { SubscriptionProvider } from "@/components/providers/subscription";
import { UserProvider } from "@/components/providers/user";
import { usePathname } from "next/navigation";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 공개 페이지들은 인증 관련 Provider 없이 렌더링
  const isPublicPage = pathname.includes('/community') || pathname.includes('/timeline');
  
  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <UserProvider>
      <SubscriptionProvider>
        <PlanSelectDialogProvider>{children}</PlanSelectDialogProvider>
      </SubscriptionProvider>
    </UserProvider>
  );
}
