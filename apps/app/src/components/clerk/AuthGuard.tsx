"use client";

import { ReactNode } from "react";
import { LoadedAuthProvider } from "./LoadedAuthProvider";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  // Stub: Always authenticated with mock user
  const mockUser = {
    id: "test_user",
    email: "test@civicaid.com",
    username: "testuser",
  };

  return <LoadedAuthProvider user={mockUser}>{children}</LoadedAuthProvider>;
}

function Skeleton() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin" />
    </div>
  );
}
