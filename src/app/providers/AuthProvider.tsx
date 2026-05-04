import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Loading } from '@/shared/ui';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return <Loading />;
  }

  return <>{children}</>;
};