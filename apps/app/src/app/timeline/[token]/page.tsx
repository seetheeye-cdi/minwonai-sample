import { TimelinePage } from "@/features/timeline/TimelinePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "민원 처리 진행상황 | CivicAid",
  description: "민원 처리 진행상황을 실시간으로 확인하세요",
};

export default function Page({
  params,
}: {
  params: { token: string };
}) {
  return <TimelinePage token={params.token} />;
}
