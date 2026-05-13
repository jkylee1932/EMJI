import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
