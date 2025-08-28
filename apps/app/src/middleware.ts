import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  // API 경로는 그대로 통과
  if (
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/monitoring")
  ) {
    return NextResponse.next();
  }

  // 공개 페이지들은 인증 없이 접근 가능
  const publicPaths = ["/community", "/timeline"];
  const isPublicPath = publicPaths.some(path => 
    req.nextUrl.pathname.includes(path)
  );
  
  if (isPublicPath) {
    return intlMiddleware(req);
  }

  // SKIP_AUTH가 true이면 모든 페이지 접근 허용
  if (process.env.NEXT_PUBLIC_SKIP_AUTH === "true") {
    return intlMiddleware(req);
  }

  // 그 외의 경우 로그인 페이지로 리다이렉트 (임시)
  // 실제 프로덕션에서는 적절한 인증 로직 구현 필요
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
