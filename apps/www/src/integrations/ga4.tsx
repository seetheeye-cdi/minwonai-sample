import { GoogleAnalytics } from "@next/third-parties/google";

export function GoogleAnalytics4() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID;
  
  // GA가 설정되지 않았으면 렌더링하지 않음
  if (!gaId) {
    return null;
  }
  
  return <GoogleAnalytics gaId={gaId} />;
}
