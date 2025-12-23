'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { TwitterIcon } from './TwitterIcon';
import type { TwitterButtonProps } from './types';
import {
  AUTH_MESSAGES,
  DEFAULT_LOGIN_REDIRECT,
} from '@/lib/auth/constants/auth';
import { Loader2 } from 'lucide-react';

export const TwitterButton = ({
  mode,
  onSuccess,
  onError,
  isLoading = false,
  disabled = false,
}: TwitterButtonProps) => {
  const handleTwitterSignIn = async () => {
    try {
      const result = await signIn('twitter', {
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
        redirect: false,
      });

      if (result?.error) {
        onError?.(new Error(result.error || AUTH_MESSAGES.ERROR_DEFAULT));
      } else if (result?.ok && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      onError?.(
        error instanceof Error ? error : new Error(AUTH_MESSAGES.ERROR_DEFAULT)
      );
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full rounded-full"
      onClick={handleTwitterSignIn}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {mode === 'login' ? 'Signing in...' : 'Signing up...'}
        </>
      ) : (
        <>
          <TwitterIcon />
          {mode === 'login' ? 'Twitter' : 'Twitter'}
        </>
      )}
    </Button>
  );
};
