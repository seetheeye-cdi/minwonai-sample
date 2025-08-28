import type { ReactNode } from 'react';

interface SignedInProps {
  children: ReactNode;
}

export function SignedIn({ children }: SignedInProps) {
  // Stub: Always show children (no auth check)
  return <>{children}</>;
}
