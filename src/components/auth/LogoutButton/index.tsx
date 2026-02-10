'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { AUTH_ROUTES } from '@/lib/auth/constants/auth';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export const LogoutButton = ({ children, className }: LogoutButtonProps) => {
  const handleLogout = () => {
    signOut({
      callbackUrl: AUTH_ROUTES.LOGIN,
      redirect: true,
    });
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className={`flex items-center gap-2 ${className || ''}`}
    >
      {children || (
        <>
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </>
      )}
    </Button>
  );
};
