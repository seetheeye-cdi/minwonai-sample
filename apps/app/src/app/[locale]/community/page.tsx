import { CommunityPage } from "@/features/community/CommunityPage";
import { Metadata } from "next";

// Force dynamic rendering for real-time community data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "민원 커뮤니티 | CivicAid",
  description: "시민들이 직접 민원을 접수하고 소통하는 공간입니다",
};

export default function Page() {
  return <CommunityPage />;
}
