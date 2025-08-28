import { InboxPage } from "@/features/inbox/InboxPage";

// Force dynamic rendering for real-time inbox data
export const dynamic = 'force-dynamic';

export default function Page() {
  return <InboxPage />;
}
