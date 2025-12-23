'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { DiscordIcon } from './DiscordIcon';
import type { DiscordButtonProps } from './types';
import {
  AUTH_MESSAGES,
  DEFAULT_LOGIN_REDIRECT,
} from '@/lib/auth/constants/auth';
import { Loader2 } from 'lucide-react';

export const DiscordButton = ({
  mode,
  onSuccess,
  onError,
  isLoading = false,
  disabled = false,
}: DiscordButtonProps) => {
  const handleDiscordSignIn = async () => {
    try {
      const result = await signIn('discord', {
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
      onClick={handleDiscordSignIn}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {mode === 'login' ? 'Signing in...' : 'Signing up...'}
        </>
      ) : (
        <>
          <DiscordIcon />
          {mode === 'login' ? 'Discord' : 'Discord'}
        </>
      )}
    </Button>
  );
};
