"use client";

import { createContext, ReactNode } from "react";

export interface LoadedUser {
  id: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  imageUrl?: string;
}

interface LoadedAuthContextValue {
  user: LoadedUser;
}

export const LoadedAuthContext = createContext<LoadedAuthContextValue | null>(
  null
);

interface LoadedAuthProviderProps {
  children: ReactNode;
  user: LoadedUser;
}

export function LoadedAuthProvider({
  children,
  user,
}: LoadedAuthProviderProps) {
  return (
    <LoadedAuthContext.Provider value={{ user }}>
      {children}
    </LoadedAuthContext.Provider>
  );
}
