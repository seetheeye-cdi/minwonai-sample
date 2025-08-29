// Prisma Client 및 타입 재수출
import { PrismaClient } from "./generated/prisma";

// Prisma Client 싱글톤 인스턴스
const createExtendedPrismaClient = () => {
  // SKIP_AUTH 모드에서는 직접 연결 URL 사용 (connection pooler 우회)
  if (process.env.SKIP_AUTH === "true" && process.env.DIRECT_URL) {
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DIRECT_URL,
        },
      },
    });
  }
  
  return new PrismaClient();
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createExtendedPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// 모든 Prisma 타입과 유틸리티 재수출
// Sentiment, TicketPriority 등 모든 타입과 enum이 포함됨
export * from "./generated/prisma";