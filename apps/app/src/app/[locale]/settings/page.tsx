import { SettingsPage } from "@/features/settings/SettingsPage";

// Force dynamic rendering for settings data
export const dynamic = 'force-dynamic';

export default function Page() {
  return <SettingsPage />;
}
