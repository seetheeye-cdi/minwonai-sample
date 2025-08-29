import { CivicDashboard } from "@/features/dashboard/CivicDashboard";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Page() {
  return <CivicDashboard />;
}
