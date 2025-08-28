"use client";

import Script from "next/script";

export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export function Clarity() {
  // Clarity가 설정되지 않았으면 렌더링하지 않음
  if (!CLARITY_PROJECT_ID) {
    return null;
  }

  return (
    <Script
      id="clarity-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
        `,
      }}
    />
  );
}

// Microsoft Clarity 초기화 함수
export const initClarity = () => {
  if (typeof window !== "undefined" && typeof window.clarity === "undefined") {
    window.clarity =
      window.clarity ||
      function () {
        // eslint-disable-next-line prefer-rest-params
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
  }
};
