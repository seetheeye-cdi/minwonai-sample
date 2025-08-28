"use client";

import { trpc } from "@/utils/trpc/client";
import { createContext, useContext } from "react";
import type { User } from "@myapp/prisma";

const UserContext = createContext<
  | {
      user: User;
    }
  | undefined
>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
  
  // Mock user data when auth is skipped
  if (skipAuth) {
    const mockUser = {
      id: "test_user",
      clerkId: "test_user",
      email: "test@example.com",
      name: "Test User",
      organizationId: "test_org",
      organization: {
        id: "test_org",
        name: "Test Organization",
      },
    };
    
    return (
      <UserContext.Provider value={{ user: mockUser as any }}>
        {children}
      </UserContext.Provider>
    );
  }
  
  const [user] = trpc.user.getMe.useSuspenseQuery(undefined, {
    retry: 0,
  });

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
