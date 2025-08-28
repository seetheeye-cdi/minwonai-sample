import { TimelinePage } from "@/features/timeline/TimelinePage";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "민원 처리 진행상황 | CivicAid",
  description: "민원 처리 진행상황을 실시간으로 확인하세요",
};

interface PageProps {
  params: Promise<{ 
    locale: string;
    token: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  // Await params in Next.js 15
  const resolvedParams = await params;
  
  // Basic UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(resolvedParams.token)) {
    notFound();
  }
  
  return <TimelinePage token={resolvedParams.token} />;
}
