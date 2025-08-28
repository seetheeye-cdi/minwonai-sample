import type { ReactNode } from 'react';

interface SignedOutProps {
  children: ReactNode;
}

export function SignedOut({ children }: SignedOutProps) {
  // Stub: Never show children (always "signed in")
  return null;
}
